import { prisma } from "../../../lib/prisma";
import { TOKEN_TYPE, createVerificationToken } from "../../../lib/verificationTokens";
import { sendVerificationEmail } from "../../../lib/email";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email } = req.body || {};
    if (!email) {
        return res.status(400).json({ error: "email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Same response whether or not the account exists / is already
    // verified, so this endpoint can't be used to enumerate accounts.
    const message = "If that account needs verification, an email was sent.";

    if (!user || user.emailVerified) {
        return res.status(200).json({ message });
    }

    const token = await createVerificationToken(
        TOKEN_TYPE.EMAIL_VERIFY,
        email,
        24 * 60
    );
    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?email=${encodeURIComponent(email)}&token=${token}`;

    try {
        await sendVerificationEmail(email, verifyUrl);
    } catch (error) {
        console.error("Failed to send verification email", error);
    }

    return res.status(200).json({ message });
}
