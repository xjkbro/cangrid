import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import { TOKEN_TYPE, consumeVerificationToken } from "../../../lib/verificationTokens";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, token, password } = req.body || {};
    if (!email || !token || !password) {
        return res.status(400).json({ error: "email, token, and password are required" });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const result = await consumeVerificationToken(TOKEN_TYPE.PASSWORD_RESET, email, token);

    if (result === "not_found") {
        return res.status(400).json({ error: "This reset link is invalid. Request a new one." });
    }
    if (result === "expired") {
        return res.status(400).json({ error: "This reset link has expired. Request a new one." });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
        where: { email },
        data: { password: hashed },
    });

    return res.status(200).json({ message: "Password updated. You can now sign in." });
}
