import { useContext, useState, useEffect } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { TextField } from "@material-ui/core";
import styled from "styled-components";
import Title from "../components/Title";
import { UserContext } from "../providers/UserContext";
import CreateUsername from "../components/CreateUsername";
import AvatarUpload from "../components/AvatarUpload";
import Layout from "../components/Layout";
import Footer from "../components/Footer";

// Real server-verifiable session check (replaces the old client-only
// redirect pattern) — see GitHub issue #3.
export async function getServerSideProps(context) {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    );

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return { props: {} };
}

const Page = styled.div`
    max-width: 640px;
    margin: 0 auto;
    padding: 8px 0 64px;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 40px;
`;

const Identity = styled.div`
    h1 {
        font-size: 1.6rem;
        color: var(--text);
    }
`;

const Handle = styled.p`
    font-family: "Nunito", sans-serif;
    color: var(--text-muted);
    margin: 4px 0 0;
`;

const Section = styled.div`
    margin-bottom: 32px;
`;

const Label = styled.h2`
    font-size: 1.05rem;
    color: var(--text);
    margin-bottom: 4px;
`;

const SectionHint = styled.p`
    font-family: "Nunito", sans-serif;
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0 0 16px;
`;

const FieldRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-width: 360px;
`;

const StyledTextField = styled(TextField)`
    font-family: "Nunito", sans-serif;

    .MuiInputLabel-root {
        font-family: "Nunito", sans-serif;
        color: var(--text-muted);
    }
    .MuiInputLabel-root.Mui-focused {
        color: var(--accent-strong);
    }
    .MuiInput-underline:before {
        border-bottom-color: var(--border);
    }
    .MuiInput-underline:after {
        border-bottom-color: var(--accent-strong);
    }
    .MuiInputBase-input {
        font-family: "Nunito", sans-serif;
        color: var(--text);
    }
`;

const Availability = styled.p`
    font-family: "Nunito", sans-serif;
    font-size: 0.8rem;
    margin: -8px 0 0;
    color: ${(props) => (props.taken ? "var(--error)" : "var(--accent-strong)")};
`;

const SaveButton = styled.button`
    align-self: flex-start;
    font-family: "Nunito", sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    color: #f7fbf9;
    background-color: var(--accent);
    border: none;
    border-radius: 8px;
    padding: 11px 22px;
    cursor: pointer;

    &:hover {
        background-color: var(--accent-strong);
    }
`;

const Saved = styled.span`
    font-family: "Nunito", sans-serif;
    font-size: 0.8rem;
    color: var(--accent-strong);
    margin-left: 12px;
`;

const NightModeRow = styled.label`
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: "Nunito", sans-serif;
    font-size: 0.9rem;
    color: var(--text);
    cursor: pointer;

    input {
        accent-color: var(--accent-strong);
        width: 16px;
        height: 16px;
    }
`;

function Profile({ nightMode: siteNightMode, setNightMode }) {
    const { userData, setUserData } = useContext(UserContext);
    const user = userData?.user;
    const [username, setUsername] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(false);
    const [saved, setSaved] = useState(false);
    const [night, setNight] = useState(false);

    useEffect(() => {
        setUsername(user?.username || "");
        setDescription(user?.description || "");
    }, [user]);

    useEffect(() => {
        // Reflects the live site-wide theme (driven by localStorage, see
        // _app.js) rather than `user.nightMode`, which can lag behind if
        // the session hasn't refreshed since the last toggle.
        setNight(siteNightMode === "true");
    }, [siteNightMode]);

    const usernameCheck = async (value) => {
        if (!value || value === user?.username) {
            setError(false);
            return;
        }
        const res = await fetch(
            `/api/users/username-check?username=${encodeURIComponent(value)}`
        );
        const { taken } = await res.json();
        setError(taken);
    };

    const save = async (e) => {
        e.preventDefault();
        if (error) return;
        const res = await fetch("/api/users/me", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, description }),
        });
        if (res.ok) {
            setUserData({ user: { ...user, username, description } });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        }
    };

    const toggleNightMode = async (e) => {
        const next = e.target.checked;
        setNight(next);
        localStorage.setItem("nightMode", next);
        setNightMode(String(next));
        setUserData({ user: { ...user, nightMode: next } });
        fetch("/api/users/me", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nightMode: next }),
        }).catch(() => {});
    };

    if (!user) return null;

    if (user.username == null) {
        return (
            <Layout>
                <div className="App">
                    <Title setNightMode={setNightMode} />
                    <Page>
                        <Section>
                            <Label>Finish setting up your account</Label>
                            <SectionHint>Pick a username to start uploading.</SectionHint>
                            <CreateUsername />
                        </Section>
                    </Page>
                </div>
                <Footer />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="App">
                <Title setNightMode={setNightMode} />
                <Page>
                    <Header>
                        <AvatarUpload username={user.username} image={user.photoURL} />
                        <Identity>
                            <h1>{user.displayName || user.username}</h1>
                            <Handle>@{user.username} · {user.email}</Handle>
                        </Identity>
                    </Header>

                    <Section>
                        <Label>Your details</Label>
                        <SectionHint>
                            This is what other people see on your grid.
                        </SectionHint>
                        <form onSubmit={save}>
                            <FieldRow>
                                <StyledTextField
                                    label="Username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        usernameCheck(e.target.value);
                                    }}
                                />
                                {error && (
                                    <Availability taken>
                                        {username} is already taken.
                                    </Availability>
                                )}
                                <StyledTextField
                                    label="Description"
                                    multiline
                                    rows={3}
                                    inputProps={{ maxLength: 150 }}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <div>
                                    <SaveButton type="submit">Save changes</SaveButton>
                                    {saved && <Saved>Saved.</Saved>}
                                </div>
                            </FieldRow>
                        </form>
                    </Section>

                    <Section>
                        <Label>Appearance</Label>
                        <NightModeRow>
                            <input
                                type="checkbox"
                                checked={night}
                                onChange={toggleNightMode}
                            />
                            Night mode
                        </NightModeRow>
                    </Section>
                </Page>
            </div>
            <Footer nightMode={String(night)} />
        </Layout>
    );
}

export default Profile;
