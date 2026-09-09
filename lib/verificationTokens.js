// Reuses the Auth.js-shaped `VerificationToken` model (identifier + token +
// expires) from the Prisma schema for our own email-verification and
// password-reset flows, rather than adding dedicated tables. NextAuth itself
// only touches this table via its "Email" provider, which isn't configured
// here, so reusing it is safe. Different purposes are distinguished by a
// prefix on `identifier` (e.g. "email-verify:<email>").
import crypto from "crypto";
import { prisma } from "./prisma";

export const TOKEN_TYPE = {
    EMAIL_VERIFY: "email-verify",
    PASSWORD_RESET: "password-reset",
};

function identifierFor(type, email) {
    return `${type}:${email}`;
}

// Invalidates any prior outstanding token of this type for this email (so an
// old link can't be used after a new one is requested), then issues a fresh
// one.
export async function createVerificationToken(type, email, ttlMinutes) {
    const identifier = identifierFor(type, email);
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await prisma.verificationToken.deleteMany({ where: { identifier } });
    await prisma.verificationToken.create({
        data: { identifier, token, expires },
    });

    return token;
}

// Single-use: the token row is deleted whether or not it was still valid, so
// a replay attempt always fails. Returns "ok" | "not_found" | "expired".
export async function consumeVerificationToken(type, email, token) {
    const identifier = identifierFor(type, email);

    const record = await prisma.verificationToken.findUnique({
        where: { identifier_token: { identifier, token } },
    });

    if (!record) {
        return "not_found";
    }

    await prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
    });

    if (record.expires < new Date()) {
        return "expired";
    }

    return "ok";
}
