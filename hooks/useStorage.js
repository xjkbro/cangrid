import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// Uploads go: browser -> presigned MinIO URL (direct PUT, no file bytes
// through the Next.js server) -> on success, a Prisma `Image` row is
// created via /api/images recording the resulting public URL, tags, and
// EXIF data. Replaces the old Firebase Storage + Firestore write flow.
const useStorage = (file, tags, caption, exifInfo) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (!file || status !== "authenticated") return;

        let cancelled = false;

        const upload = async () => {
            try {
                const presignRes = await fetch("/api/storage/presign-upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: file.name,
                        contentType: file.type,
                    }),
                });

                if (!presignRes.ok) {
                    const body = await presignRes.json().catch(() => ({}));
                    throw new Error(body.error || "Failed to get upload URL");
                }

                const { uploadUrl, publicUrl } = await presignRes.json();

                await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open("PUT", uploadUrl, true);
                    xhr.setRequestHeader("Content-Type", file.type);
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            setProgress((event.loaded / event.total) * 100);
                        }
                    };
                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve();
                        } else {
                            reject(
                                new Error(`Upload failed with status ${xhr.status}`)
                            );
                        }
                    };
                    xhr.onerror = () => reject(new Error("Upload failed"));
                    xhr.send(file);
                });

                if (cancelled) return;

                const createRes = await fetch("/api/images", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        url: publicUrl,
                        caption,
                        tags,
                        exif: exifInfo,
                    }),
                });

                if (!createRes.ok) {
                    const body = await createRes.json().catch(() => ({}));
                    throw new Error(body.error || "Failed to save image");
                }

                if (!cancelled) setUrl(publicUrl);
            } catch (err) {
                if (!cancelled) setError(err);
            }
        };

        upload();

        return () => {
            cancelled = true;
        };
    }, [file]);

    return { progress, error, url };
};

export default useStorage;
