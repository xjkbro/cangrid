// next/image needs the MinIO public hostname allowlisted; derive it from
// env rather than hardcoding, since it differs between local dev and prod.
function minioImagePattern() {
    const raw = process.env.MINIO_PUBLIC_URL || process.env.MINIO_ENDPOINT;
    if (!raw) return null;
    try {
        const url = raw.startsWith("http") ? new URL(raw) : new URL(`http://${raw}`);
        return {
            protocol: url.protocol.replace(":", ""),
            hostname: url.hostname,
        };
    } catch (err) {
        return null;
    }
}

const minioPattern = minioImagePattern();

module.exports = {
    // reactStrictMode: true,
    output: "standalone",
    images: {
        remotePatterns: minioPattern ? [minioPattern] : [],
    },
    compiler: {
        styledComponents: true,
    },
    // Repo already maintains a real AGENTS.md (see docs/agents/); don't let
    // `next dev` overwrite it with Next's own generated agent-rules block.
    agentRules: false,
};
