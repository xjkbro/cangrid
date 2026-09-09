# syntax=docker/dockerfile:1
#
# Multi-stage build for Dokploy. This image talks to MariaDB and MinIO
# purely over the network via env vars (DATABASE_URL, MINIO_*) — it does
# NOT run either of those itself. Both are already-provisioned, standing
# Dokploy services; see .env.example for the full list of required vars.

# ---- deps: install dependencies (with native build tooling for bcrypt) ----
FROM node:20-slim AS deps
WORKDIR /app
# bcrypt compiles a native addon at install time; openssl is required by
# Prisma's query engine to detect the correct OpenSSL build at runtime.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ openssl \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# ---- builder: generate Prisma client + build Next.js (standalone) ----
FROM node:20-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# TEMP(verification-only, remove before real use): firebase/config.js still
# throws at import time without a syntactically-present API key, so a bare
# `npm run build` fails here until ticket #8 removes Firebase. Wiring these
# dummy values through just to prove the rest of this Dockerfile's pipeline
# builds correctly end-to-end.
ARG NEXT_PUBLIC_FIREBASE_APIKEY=dummy
ARG NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=dummy.firebaseapp.com
ARG NEXT_PUBLIC_FIREBASE_PROJECTID=dummy
ARG NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=dummy.appspot.com
ARG NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER=0
ARG NEXT_PUBLIC_FIREBASE_APPID=dummy
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT=dummy
ENV NEXT_PUBLIC_FIREBASE_APIKEY=$NEXT_PUBLIC_FIREBASE_APIKEY
ENV NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=$NEXT_PUBLIC_FIREBASE_AUTHDOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECTID=$NEXT_PUBLIC_FIREBASE_PROJECTID
ENV NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=$NEXT_PUBLIC_FIREBASE_STORAGEBUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER=$NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER
ENV NEXT_PUBLIC_FIREBASE_APPID=$NEXT_PUBLIC_FIREBASE_APPID
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT=$NEXT_PUBLIC_FIREBASE_MEASUREMENT
# `prisma generate` only reads prisma/schema.prisma to emit the client — it
# does not connect to DATABASE_URL, so no real DB access is needed to build.
RUN npx prisma generate
# lib/prisma.js constructs the MariaDB driver adapter eagerly at module load
# (`new PrismaMariaDb(process.env.DATABASE_URL)`), and that module is now
# imported by pages that get evaluated during `next build`'s page-data
# collection (e.g. /profile, the NextAuth route). The adapter only needs a
# well-formed URL to construct successfully — it doesn't connect until an
# actual query runs — so a syntactically valid placeholder is enough at
# build time. This one, unlike the Firebase vars above, is a permanent part
# of this Dockerfile, not a temporary Firebase-removal workaround: pass a
# real value via --build-arg if a pipeline ever wants one, but the build
# never requires live DB access to succeed.
ARG DATABASE_URL=mysql://user:password@localhost:3306/dummy
ENV DATABASE_URL=$DATABASE_URL
RUN npm run build

# ---- runner: minimal runtime image ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/* \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Next's standalone output already carries a pruned node_modules with only
# what the server actually requires at runtime, plus our own traced local
# modules (e.g. lib/generated/prisma, the custom Prisma client output path).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# The standalone trace does NOT include the `prisma` CLI (it's never
# `require()`d by the running server, only invoked as a separate process at
# container startup to apply migrations). The CLI's own dependency tree
# (@prisma/config, effect, and further transitive deps beneath those) is
# deep enough that hand-picking individual packages is a losing game — copy
# the builder's complete, correctly-resolved node_modules instead. It lands
# on top of (merges with) the standalone trace's own pruned node_modules
# already placed at this path, so the running server keeps using its lean
# traced set; this just adds what the CLI additionally needs.
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

# Dokploy convention: point its proxy/health check at this port.
ENV PORT=3000
EXPOSE 3000
# No dedicated health-check route exists yet — Dokploy can probe `/` (200
# once migrations succeed and the server is up) until one exists.

# Apply any pending migrations against the production MariaDB, then start
# the standalone server. Always `migrate deploy` here, never `migrate dev`
# (which can prompt interactively and isn't safe against prod data).
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node server.js"]
