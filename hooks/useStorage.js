import { useState, useEffect, useContext } from "react";
import { auth, projectFirestore, timestamp } from "../firebase/config";
import { UserContext } from "../providers/UserContext";
import { useAuthState } from "react-firebase-hooks/auth";

// Uploads go: browser -> presigned MinIO URL (direct PUT, no file bytes
// through the Next.js server) -> on success, the resulting public URL is
// recorded as the image's url. Replaces the old Firebase Storage
// `storageRef.put(file)` flow.
const useStorage = (file, tags, caption, exifInfo) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    const [user] = useAuthState(auth);
    const { userData } = useContext(UserContext);

    useEffect(() => {
        if (!file || !user) return;

        let cancelled = false;

        const upload = async () => {
            try {
                const presignRes = await fetch("/api/storage/presign-upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: file.name,
                        contentType: file.type,
                        userId: user.uid,
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

                // TODO(#5): this Firestore write is temporary — ticket #5
                // replaces the whole data-access layer with Prisma-backed
                // API routes. Only the storage destination changes in this
                // ticket; the resulting `publicUrl` is what will be written
                // to the Prisma `Image.url` field once #5 lands.
                const collectionRef = projectFirestore.collection("images");
                const userImageCollectionRef = projectFirestore
                    .doc(`users/${user.uid}`)
                    .collection("images");

                const insert = {
                    url: publicUrl,
                    createdAt: timestamp(),
                    caption,
                    tags,
                    exif: exifInfo,
                    userData: userData.user,
                    comments: [],
                    likes: [],
                    likeCount: 0,
                };
                const imgRef = await collectionRef.add(insert);
                await userImageCollectionRef.add({ imageRef: imgRef });

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
