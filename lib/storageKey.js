import { v4 as uuidv4 } from "uuid";

// Strip anything that isn't safe as an S3/MinIO object-key path segment.
function sanitizeFilename(filename) {
    return filename
        .normalize("NFKD")
        .replace(/[^\w.\-]+/g, "-")
        .replace(/-+/g, "-")
        .slice(-100); // guard against absurdly long names
}

// Namespaces every upload under the owning user's id and gives it a random
// prefix, so two uploads of the same filename never collide (the old
// Firebase Storage integration used the raw filename as the key).
export function buildObjectKey(userId, filename) {
    if (!userId) throw new Error("buildObjectKey requires a userId");
    const safeName = sanitizeFilename(filename || "upload");
    return `${userId}/${uuidv4()}-${safeName}`;
}
