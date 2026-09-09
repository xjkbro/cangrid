import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Google OAuth is deliberately NOT wired up yet — kept here, disabled, so
// re-enabling it later (once a production domain + fresh Google OAuth
// credentials exist) needs no new plumbing. See GitHub issue #3.
// import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";

const GOOGLE_SIGNIN_ENABLED = process.env.GOOGLE_SIGNIN_ENABLED === "true";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    // DEVIATION FROM ISSUE #3's SPEC: the ticket asked for database
    // sessions, but NextAuth v4 hard-disallows database-strategy sessions
    // whenever a Credentials provider is configured (confirmed at runtime:
    // `CALLBACK_CREDENTIALS_JWT_ERROR — Signin in with credentials only
    // supported if JWT strategy is enabled`). This isn't a config knob, it's
    // enforced by next-auth itself, so JWT is the only viable strategy here.
    // The underlying goal — a real, tamper-evident, server-verifiable
    // session replacing Firebase's client-only auth state — is still met: a
    // JWT strategy session is a signed cookie verified server-side via
    // `getServerSession`/`getToken`, not client-trusted state. The Prisma
    // `Session` table stays in the schema and adapter for when/if a future
    // provider that supports database sessions is added; it's simply unused
    // while only the Credentials provider is active.
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    return null;
                }

                const valid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );
                if (!valid) {
                    return null;
                }

                return user;
            },
        }),
        // Disabled pending a production domain + fresh Google OAuth
        // credentials (explicit decision, see issue #3). Flip
        // GOOGLE_SIGNIN_ENABLED=true and uncomment the import above once
        // ready — no other plumbing changes needed.
        ...(GOOGLE_SIGNIN_ENABLED
            ? [
                  // GoogleProvider({
                  //     clientId: process.env.GOOGLE_CLIENT_ID,
                  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                  // }),
              ]
            : []),
    ],
    callbacks: {
        // Under the "jwt" strategy, `authorize()`'s return value only flows
        // into the session via the token — persist the fields the rest of
        // the app needs onto the token at sign-in time.
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.displayName = user.displayName;
                token.description = user.description;
                token.nightMode = user.nightMode;
                token.photoURL = user.image;
                // Soft-restriction decision (ticket #4): unverified users can
                // still sign in; this flag lets the UI show a "please
                // verify" prompt instead of blocking access outright.
                token.emailVerified = !!user.emailVerified;
            }
            return token;
        },
        // Enrich the session with the app-specific fields the rest of the
        // app expects, matching the shape the old Firebase user object had
        // (see UserContext).
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.username = token.username;
            session.user.displayName = token.displayName;
            session.user.description = token.description;
            session.user.nightMode = token.nightMode;
            session.user.photoURL = token.photoURL;
            session.user.emailVerified = token.emailVerified;
            return session;
        },
    },
};

export default NextAuth(authOptions);
