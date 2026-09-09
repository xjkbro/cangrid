import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "../../../../lib/prisma";

// Replaces `addImgComment` (firebase/config.js) — a read-modify-write on a
// raw `comments` array field — with a plain insert into the `Comment` table.
export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: "Not signed in" });
    }

    const { id: imageId } = req.query;
    const { comment } = req.body || {};
    if (!comment || !comment.trim()) {
        return res.status(400).json({ error: "comment is required" });
    }

    await prisma.comment.create({
        data: {
            body: comment.trim(),
            userId: session.user.id,
            imageId,
        },
    });

    const comments = await prisma.comment.findMany({
        where: { imageId },
        orderBy: { createdAt: "asc" },
        include: { user: { select: { username: true, image: true } } },
    });

    return res.status(200).json({
        comments: comments.map((c) => ({
            comment: c.body,
            user: { username: c.user.username, photoURL: c.user.image },
        })),
    });
}
