import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../components/Layout";
import {
    Shell,
    Hero,
    Aperture,
    Wordmark,
    Tagline,
    Panel,
    Form,
    Headline,
    Subtext,
    FieldStack,
    ErrorText,
    InfoText,
    SubmitButton,
    Meta,
    ToggleText,
    StyledTextField,
} from "../components/AuthShell";

const VERIFY_MESSAGES = {
    success: "Email verified. You can now sign in.",
    expired: "That verification link expired. Sign in and request a new one from your profile.",
    invalid: "That verification link is invalid.",
};

const COPY = {
    signin: {
        headline: "Welcome back.",
        subtext: "Sign in to see what's new on your grid.",
        submit: "Sign in",
    },
    signup: {
        headline: "Join Cangrid.",
        subtext: "Create an account to start building your grid.",
        submit: "Create account",
    },
};

function Login() {
    const { data: session } = useSession();
    const router = useRouter();
    const [mode, setMode] = useState("signin"); // "signin" | "signup"
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const verifyStatus = VERIFY_MESSAGES[router.query.verify] || "";
    const copy = COPY[mode];

    useEffect(() => {
        if (session) {
            router.push("/");
        }
    }, [session]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        setSubmitting(false);
        if (res?.error) {
            setError("That email or password isn't right.");
        } else {
            router.push("/");
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password }),
        });
        const body = await res.json();
        if (!res.ok) {
            setSubmitting(false);
            setError(body.error || "Could not create your account.");
            return;
        }
        const signInRes = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        setSubmitting(false);
        if (signInRes?.error) {
            setError("Account created — sign in below.");
            setMode("signin");
        } else {
            router.push("/");
        }
    };

    return (
        <Layout>
            <Shell>
                <Hero>
                    <Aperture />
                    <Wordmark>Cangrid</Wordmark>
                    <Tagline>Every photo starts with a little light.</Tagline>
                </Hero>
                <Panel>
                    <Form>
                        <Headline>{copy.headline}</Headline>
                        <Subtext>{copy.subtext}</Subtext>
                        {verifyStatus && <InfoText style={{ marginBottom: 20 }}>{verifyStatus}</InfoText>}
                        <form
                            onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
                        >
                            <FieldStack>
                                <StyledTextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    fullWidth
                                />
                                {mode === "signup" && (
                                    <StyledTextField
                                        label="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        fullWidth
                                    />
                                )}
                                <StyledTextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    fullWidth
                                />
                                {error && <ErrorText>{error}</ErrorText>}
                                <SubmitButton type="submit" disabled={submitting}>
                                    {copy.submit}
                                </SubmitButton>
                            </FieldStack>
                        </form>
                        <Meta>
                            <span>
                                {mode === "signin" ? "Need an account? " : "Already have an account? "}
                                <ToggleText
                                    onClick={() => {
                                        setError("");
                                        setMode(mode === "signin" ? "signup" : "signin");
                                    }}
                                >
                                    {mode === "signin" ? "Sign up" : "Sign in"}
                                </ToggleText>
                            </span>
                            {mode === "signin" && (
                                <Link href="/forgot-password">Forgot password?</Link>
                            )}
                        </Meta>
                    </Form>
                </Panel>
            </Shell>
        </Layout>
    );
}
export default Login;
