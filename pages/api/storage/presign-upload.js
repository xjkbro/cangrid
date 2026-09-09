import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getMinioClient, MINIO_BUCKET, buildPublicUrl } from "../../../lib/minioClient";
import { buildObjectKey } from "../../../lib/storageKey";

const ALLOWED_CONTENT_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const UPLOAD_URL_TTL_SECONDS = 5 * 60;

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { filename, contentType, userId } = req.body || {};

    if (!filename || !contentType || !userId) {
        return res
            .status(400)
            .json({ error: "filename, contentType, and userId are required" });
    }

    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
        return res.status(400).json({ error: "Unsupported content type" });
    }

    // NOTE: userId is trusted from the request body, matching the trust
    // model already in use throughout this codebase today (no
    // firebase-admin / server-verified session exists yet). Once #3
    // (Auth.js) lands, replace this with the userId from the verified
    // server-side session instead of a client-supplied value.
    try {
        const key = buildObjectKey(userId, filename);
        const client = getMinioClient();

        const command = new PutObjectCommand({
            Bucket: MINIO_BUCKET(),
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(client, command, {
            expiresIn: UPLOAD_URL_TTL_SECONDS,
        });

        return res.status(200).json({
            uploadUrl,
            key,
            publicUrl: buildPublicUrl(key),
        });
    } catch (error) {
        console.error("Error creating presigned upload URL", error);
        return res.status(500).json({ error: "Could not create upload URL" });
    }
}
