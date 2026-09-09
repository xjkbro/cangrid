// One-off setup script: ensures the configured MinIO bucket exists and is
// readable publicly (GetObject only) so uploaded images can be served
// directly via their public URL, matching the old Firebase Storage
// getDownloadURL() behavior. Run manually against a target MinIO instance:
//
//   node scripts/minio-setup.js
//
// Requires MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET
// (and optionally MINIO_USE_SSL) to be set in the environment.
require("dotenv").config({ path: ".env.local" });

const {
    S3Client,
    HeadBucketCommand,
    CreateBucketCommand,
    PutBucketPolicyCommand,
} = require("@aws-sdk/client-s3");

async function main() {
    const bucket = process.env.MINIO_BUCKET;
    if (!bucket) {
        throw new Error("MINIO_BUCKET is not set");
    }

    const useSSL = process.env.MINIO_USE_SSL === "true";
    const endpoint = process.env.MINIO_ENDPOINT.startsWith("http")
        ? process.env.MINIO_ENDPOINT
        : `${useSSL ? "https" : "http"}://${process.env.MINIO_ENDPOINT}`;

    const client = new S3Client({
        endpoint,
        region: process.env.MINIO_REGION || "us-east-1",
        credentials: {
            accessKeyId: process.env.MINIO_ACCESS_KEY,
            secretAccessKey: process.env.MINIO_SECRET_KEY,
        },
        forcePathStyle: true,
    });

    try {
        await client.send(new HeadBucketCommand({ Bucket: bucket }));
        console.log(`Bucket "${bucket}" already exists.`);
    } catch (err) {
        console.log(`Bucket "${bucket}" not found, creating it...`);
        await client.send(new CreateBucketCommand({ Bucket: bucket }));
        console.log(`Bucket "${bucket}" created.`);
    }

    const publicReadPolicy = {
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "PublicReadGetObject",
                Effect: "Allow",
                Principal: "*",
                Action: ["s3:GetObject"],
                Resource: [`arn:aws:s3:::${bucket}/*`],
            },
        ],
    };

    await client.send(
        new PutBucketPolicyCommand({
            Bucket: bucket,
            Policy: JSON.stringify(publicReadPolicy),
        })
    );
    console.log(`Public-read policy applied to "${bucket}" (GetObject only).`);
}

main().catch((err) => {
    console.error("minio-setup failed:", err);
    process.exit(1);
});
