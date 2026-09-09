import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "../../../../lib/prisma";

// Replaces `imgLike` (firebase/config.js) — a non-atomic array push/pull
// with a manually-synced `likeCount` field. This is an atomic upsert/delete
// against the `Like` join table's unique (userId, imageId) constraint
// instead, with the count derived via aggregate rather than stored.
export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: "Not signed in" });
    }

    const { id: imageId } = req.query;
    const userId = session.user.id;

    if (req.method === "POST") {
        // Idempotent: a duplicate like attempt (e.g. a double-click racing
        // itself) hits the unique constraint and is treated as a no-op
        // rather than an error.
        await prisma.like.upsert({
            where: { userId_imageId: { userId, imageId } },
            update: {},
            create: { userId, imageId },
        });
    } else if (req.method === "DELETE") {
        await prisma.like.deleteMany({
            where: { userId, imageId },
        });
    } else {
        res.setHeader("Allow", "POST, DELETE");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const likeCount = await prisma.like.count({ where: { imageId } });
    return res.status(200).json({
        liked: req.method === "POST",
        likeCount,
    });
}
