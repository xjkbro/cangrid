import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "../../../../lib/prisma";
import { extractObjectKey, deleteObject } from "../../../../lib/minioClient";

export default async function handler(req, res) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        res.setHeader("Allow", "DELETE, PATCH");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: "Not signed in" });
    }

    const { id } = req.query;

    const image = await prisma.image.findUnique({
        where: { id },
        select: { userId: true, url: true },
    });

    if (!image) {
        return res.status(404).json({ error: "Photo not found" });
    }

    if (image.userId !== session.user.id) {
        return res
            .status(403)
            .json({ error: "You can only edit your own photos" });
    }

    if (req.method === "PATCH") {
        const { caption } = req.body || {};
        if (caption === undefined) {
            return res.status(400).json({ error: "Nothing to update" });
        }
        const updated = await prisma.image.update({
            where: { id },
            data: { caption },
            select: { caption: true },
        });
        return res.status(200).json(updated);
    }

    // Comments, likes, and EXIF cascade-delete via the schema's onDelete:
    // Cascade — only the storage object needs cleaning up separately.
    await prisma.image.delete({ where: { id } });

    try {
        const key = extractObjectKey(image.url);
        if (key) await deleteObject(key);
    } catch (error) {
        // Best-effort: the record users actually see is already gone, so
        // don't fail the request over an orphaned storage object.
        console.error("Failed to delete MinIO object for image", id, error);
    }

    return res.status(200).json({ deleted: true });
}
