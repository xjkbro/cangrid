import { S3Client } from "@aws-sdk/client-s3";

const requiredEnv = [
    "MINIO_ENDPOINT",
    "MINIO_ACCESS_KEY",
    "MINIO_SECRET_KEY",
    "MINIO_BUCKET",
];

function assertServerSide() {
    if (typeof window !== "undefined") {
        throw new Error("minioClient must only be used server-side");
    }
}

let cachedClient = null;

export function getMinioClient() {
    assertServerSide();

    for (const key of requiredEnv) {
        if (!process.env[key]) {
            throw new Error(`Missing required env var: ${key}`);
        }
    }

    if (cachedClient) return cachedClient;

    const useSSL = process.env.MINIO_USE_SSL === "true";
    const endpoint = process.env.MINIO_ENDPOINT.startsWith("http")
        ? process.env.MINIO_ENDPOINT
        : `${useSSL ? "https" : "http"}://${process.env.MINIO_ENDPOINT}`;

    cachedClient = new S3Client({
        endpoint,
        region: process.env.MINIO_REGION || "us-east-1",
        credentials: {
            accessKeyId: process.env.MINIO_ACCESS_KEY,
            secretAccessKey: process.env.MINIO_SECRET_KEY,
        },
        // MinIO is not virtual-hosted-style by default; path-style addressing
        // (http://host:port/bucket/key) is required unless configured otherwise.
        forcePathStyle: true,
    });

    return cachedClient;
}

export const MINIO_BUCKET = () => process.env.MINIO_BUCKET;

// The URL clients/browsers use to actually reach objects (e.g. through a
// reverse proxy or public hostname), which may differ from MINIO_ENDPOINT
// when the app talks to MinIO over an internal/docker network. Falls back
// to MINIO_ENDPOINT when no separate public URL is configured.
export function getMinioPublicBaseUrl() {
    const raw = process.env.MINIO_PUBLIC_URL || process.env.MINIO_ENDPOINT;
    if (!raw) {
        throw new Error(
            "Missing required env var: MINIO_PUBLIC_URL or MINIO_ENDPOINT"
        );
    }
    const useSSL = process.env.MINIO_USE_SSL === "true";
    const base = raw.startsWith("http")
        ? raw
        : `${useSSL ? "https" : "http"}://${raw}`;
    return base.replace(/\/+$/, "");
}

export function buildPublicUrl(objectKey) {
    return `${getMinioPublicBaseUrl()}/${MINIO_BUCKET()}/${objectKey}`;
}
