// next/image needs the MinIO public hostname allowlisted. This is resolved
// once at `next build` time and compiled into the output — a runtime env
// var set after the build (e.g. in a platform's "Environment Variables"
// UI, as opposed to a Docker build arg) can't change it retroactively.
// There's only one MinIO instance across every environment here (no
// separate local/prod instances), so the hostname is effectively fixed —
// falling back to the known value if it isn't provided at build time keeps
// this working regardless of whether the deploy platform actually passes
// build args through to `docker build`.
const DEFAULT_MINIO_ENDPOINT = "https://minio-api.jkbro.dev";

function minioImagePattern() {
    const raw =
        process.env.MINIO_PUBLIC_URL ||
        process.env.MINIO_ENDPOINT ||
        DEFAULT_MINIO_ENDPOINT;
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
