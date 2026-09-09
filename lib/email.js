// Thin Resend wrapper for the two transactional emails this app sends
// (verification, password reset). Lazily constructs the client so simply
// importing this module never throws when RESEND_API_KEY isn't set yet —
// only an actual send attempt fails, with a clear error.
import { Resend } from "resend";

let client = null;

function getClient() {
    if (!process.env.RESEND_API_KEY) {
        throw new Error(
            "RESEND_API_KEY is not set — cannot send email. Add it to .env."
        );
    }
    if (!client) {
        client = new Resend(process.env.RESEND_API_KEY);
    }
    return client;
}

function fromAddress() {
    // Resend's shared onboarding domain works without any domain
    // verification, suitable until this app has its own production domain.
    return process.env.FROM_EMAIL || "onboarding@resend.dev";
}

export async function sendVerificationEmail(to, verifyUrl) {
    await getClient().emails.send({
        from: fromAddress(),
        to,
        subject: "Verify your Cangrid email",
        html: `
            <p>Welcome to Cangrid! Confirm your email address to finish setting up your account.</p>
            <p><a href="${verifyUrl}">Verify my email</a></p>
            <p>If the link doesn't work, copy and paste this URL into your browser:<br>${verifyUrl}</p>
            <p>This link expires in 24 hours. If you didn't create a Cangrid account, you can ignore this email.</p>
        `,
    });
}

export async function sendPasswordResetEmail(to, resetUrl) {
    await getClient().emails.send({
        from: fromAddress(),
        to,
        subject: "Reset your Cangrid password",
        html: `
            <p>We received a request to reset your Cangrid password.</p>
            <p><a href="${resetUrl}">Reset my password</a></p>
            <p>If the link doesn't work, copy and paste this URL into your browser:<br>${resetUrl}</p>
            <p>This link expires in 1 hour. If you didn't request this, you can ignore this email — your password won't change.</p>
        `,
    });
}
