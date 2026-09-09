import { prisma } from "../../../lib/prisma";
import { TOKEN_TYPE, consumeVerificationToken } from "../../../lib/verificationTokens";

// GET so the link in the email can be clicked directly. Redirects back into
// the app with a query flag rather than rendering JSON, since a human is
// the one following this link.
export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, token } = req.query;

    if (!email || !token) {
        return res.redirect(302, "/login?verify=invalid");
    }

    const result = await consumeVerificationToken(
        TOKEN_TYPE.EMAIL_VERIFY,
        email,
        token
    );

    if (result === "not_found") {
        return res.redirect(302, "/login?verify=invalid");
    }
    if (result === "expired") {
        return res.redirect(302, "/login?verify=expired");
    }

    await prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
    });

    return res.redirect(302, "/login?verify=success");
}
