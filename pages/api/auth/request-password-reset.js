import { prisma } from "../../../lib/prisma";
import { TOKEN_TYPE, createVerificationToken } from "../../../lib/verificationTokens";
import { sendPasswordResetEmail } from "../../../lib/email";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email } = req.body || {};
    if (!email) {
        return res.status(400).json({ error: "email is required" });
    }

    // Same response whether or not the account exists, so this endpoint
    // can't be used to enumerate accounts.
    const message = "If an account with that email exists, a reset link was sent.";

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
        // No account, or an OAuth-only account with no password to reset.
        return res.status(200).json({ message });
    }

    const token = await createVerificationToken(TOKEN_TYPE.PASSWORD_RESET, email, 60);
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

    try {
        await sendPasswordResetEmail(email, resetUrl);
    } catch (error) {
        console.error("Failed to send password reset email", error);
    }

    return res.status(200).json({ message });
}
