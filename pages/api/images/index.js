import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../lib/prisma";

// EXIF date comes from the camera as "YYYY:MM:DD HH:MM:SS"; Prisma needs a
// real Date for the `DateTime` column.
function parseExifDate(raw) {
    if (!raw || typeof raw !== "string") return null;
    const [datePart, timePart] = raw.split(" ");
    if (!datePart || !timePart) return null;
    const [year, month, day] = datePart.split(":");
    const iso = `${year}-${month}-${day}T${timePart}`;
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? null : date;
}

// Creates the Prisma `Image` row after a successful direct-to-MinIO upload
// (ticket #2). Replaces the Firestore writes that used to happen inline in
// `hooks/useStorage.js`.
export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: "Not signed in" });
    }

    const { url, caption, tags, exif } = req.body || {};
    if (!url) {
        return res.status(400).json({ error: "url is required" });
    }

    const tagNames = Array.isArray(tags)
        ? [...new Set(tags.map((t) => String(t).toLowerCase().trim()).filter(Boolean))]
        : [];

    try {
        const image = await prisma.image.create({
            data: {
                url,
                caption: caption || "",
                userId: session.user.id,
                tags: {
                    connectOrCreate: tagNames.map((name) => ({
                        where: { name },
                        create: { name },
                    })),
                },
                exif: exif
                    ? {
                          create: {
                              make: exif.make || null,
                              model: exif.model || null,
                              iso: exif.iso ? Number(exif.iso) : null,
                              focalLength: exif.focalLength
                                  ? String(exif.focalLength)
                                  : null,
                              aperture: exif.aperture
                                  ? String(exif.aperture)
                                  : null,
                              exposure: exif.exposure
                                  ? String(exif.exposure)
                                  : null,
                              flash: exif.flash ? String(exif.flash) : null,
                              cameraFunction: exif.cameraFunction
                                  ? String(exif.cameraFunction)
                                  : null,
                              dateCaptured: parseExifDate(exif.dateCaptured),
                          },
                      }
                    : undefined,
            },
            select: { id: true },
        });

        return res.status(201).json({ id: image.id });
    } catch (error) {
        console.error("Error creating image", error);
        return res.status(500).json({ error: "Could not create image" });
    }
}
