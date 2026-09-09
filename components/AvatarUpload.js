import { useContext, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import styled from "styled-components";
import { UserContext } from "../providers/UserContext";

const Ring = styled.button`
    position: relative;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    padding: 0;
    border: 2px solid var(--border);
    background: var(--surface);
    cursor: pointer;
    overflow: hidden;
    flex: none;

    &:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }
`;

const Avatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`;

const Placeholder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Noto Serif", serif;
    font-size: 2rem;
    color: var(--text-muted);
    background: var(--bg);
`;

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(30, 43, 42, 0.55);
    color: #f7fbf9;
    font-family: "Nunito", sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    opacity: 0;
    transition: opacity 150ms ease;

    ${Ring}:hover &,
    ${Ring}:focus-visible & {
        opacity: 1;
    }
`;

const Status = styled.p`
    font-family: "Nunito", sans-serif;
    font-size: 0.8rem;
    color: var(--text-muted);
    margin: 8px 0 0;
`;

// Reuses the same presigned-upload flow as gallery photos (#2/#5): browser
// -> presigned MinIO PUT -> the resulting public URL gets saved as
// User.image via PATCH /api/users/me.
export default function AvatarUpload({ username, image }) {
    const { userData, setUserData } = useContext(UserContext);
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setError("");
        setUploading(true);
        try {
            const compressed = await imageCompression(file, {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 512,
            });

            const presignRes = await fetch("/api/storage/presign-upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                }),
            });
            if (!presignRes.ok) throw new Error("Could not start the upload.");
            const { uploadUrl, publicUrl } = await presignRes.json();

            const putRes = await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: compressed,
            });
            if (!putRes.ok) throw new Error("The upload didn't go through.");

            const patchRes = await fetch("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: publicUrl }),
            });
            if (!patchRes.ok) throw new Error("Could not save your new photo.");

            setUserData({
                user: { ...userData.user, photoURL: publicUrl },
            });
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Ring
                type="button"
                onClick={() => inputRef.current?.click()}
                aria-label="Change profile photo"
            >
                {image ? (
                    <Avatar src={image} alt="" />
                ) : (
                    <Placeholder aria-hidden="true">
                        {username?.[0]?.toUpperCase() || "?"}
                    </Placeholder>
                )}
                <Overlay>{uploading ? "Uploading…" : "Change photo"}</Overlay>
            </Ring>
            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFile}
                style={{ display: "none" }}
            />
            {error && <Status style={{ color: "var(--error)" }}>{error}</Status>}
        </div>
    );
}
