import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import { TOKEN_TYPE, createVerificationToken } from "../../../lib/verificationTokens";
import { sendVerificationEmail } from "../../../lib/email";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, username, password } = req.body || {};

    if (!email || !username || !password) {
        return res
            .status(400)
            .json({ error: "email, username, and password are required" });
    }

    if (!USERNAME_PATTERN.test(username)) {
        return res.status(400).json({
            error:
                "Username must be 3-20 characters and contain only letters, numbers, and underscores",
        });
    }

    if (password.length < 8) {
        return res
            .status(400)
            .json({ error: "Password must be at least 8 characters" });
    }

    const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
    });
    if (existing) {
        return res.status(409).json({
            error:
                existing.email === email
                    ? "An account with that email already exists"
                    : "That username is already taken",
        });
    }

    const hashed = await bcrypt.hash(password, 12);

    let user;
    try {
        user = await prisma.user.create({
            data: { email, username, password: hashed },
        });
    } catch (error) {
        console.error("Error creating user", error);
        return res.status(500).json({ error: "Could not create account" });
    }

    // Verification email is best-effort: a failure here (e.g. no
    // RESEND_API_KEY configured yet) shouldn't fail account creation —
    // sign-in isn't blocked on verification (soft restriction, see #4).
    try {
        const token = await createVerificationToken(TOKEN_TYPE.EMAIL_VERIFY, email, 24 * 60);
        const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?email=${encodeURIComponent(email)}&token=${token}`;
        await sendVerificationEmail(email, verifyUrl);
    } catch (error) {
        console.error("Failed to send verification email", error);
    }

    return res.status(201).json({ id: user.id, email: user.email });
}
