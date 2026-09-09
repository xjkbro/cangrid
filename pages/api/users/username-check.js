import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

// Replaces the old `getUsernameDoc` client-side full-collection scan with a
// single indexed lookup against the DB-level unique constraint (#1).
export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { username } = req.query;
    if (!username) {
        return res.status(400).json({ error: "username is required" });
    }

    const session = await getServerSession(req, res, authOptions);

    const existing = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
    });

    // A user checking their own current, unchanged username shouldn't see
    // it reported as taken.
    const taken = Boolean(existing) && existing.id !== session?.user?.id;

    return res.status(200).json({ taken });
}
