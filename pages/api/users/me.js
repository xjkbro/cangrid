import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

// Replaces `updateUserDocument`/`generateUserDocument`/`setNightModeSetting`
// (firebase/config.js) — profile edits, initial username selection, and the
// night-mode toggle all go through this one session-authenticated endpoint.
export default async function handler(req, res) {
    if (req.method !== "PATCH") {
        res.setHeader("Allow", "PATCH");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: "Not signed in" });
    }

    const { username, description, nightMode, image } = req.body || {};
    const data = {};

    if (username !== undefined) {
        if (!USERNAME_PATTERN.test(username)) {
            return res.status(400).json({
                error:
                    "Username must be 3-20 characters and contain only letters, numbers, and underscores",
            });
        }
        const existing = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });
        if (existing && existing.id !== session.user.id) {
            return res
                .status(409)
                .json({ error: "That username is already taken" });
        }
        data.username = username;
    }

    if (description !== undefined) {
        data.description = description;
    }

    if (nightMode !== undefined) {
        data.nightMode = Boolean(nightMode);
    }

    if (image !== undefined) {
        data.image = image;
    }

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
    }

    try {
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data,
        });

        return res.status(200).json({
            uid: user.id,
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            description: user.description,
            nightMode: user.nightMode,
            photoURL: user.image,
        });
    } catch (error) {
        console.error("Error updating user", error);
        return res.status(500).json({ error: "Could not update profile" });
    }
}
