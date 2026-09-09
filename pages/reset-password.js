import { useState } from "react";
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
    StyledTextField,
} from "../components/AuthShell";

function ResetPassword() {
    const router = useRouter();
    const { email, token } = router.query;
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Those passwords don't match.");
            return;
        }
        setSubmitting(true);
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token, password }),
        });
        const body = await res.json();
        setSubmitting(false);
        if (!res.ok) {
            setError(body.error || "Could not reset your password.");
            return;
        }
        setDone(true);
    };

    const shell = (content) => (
        <Layout>
            <Shell>
                <Hero>
                    <Aperture />
                    <Wordmark>Cangrid</Wordmark>
                    <Tagline>Every photo starts with a little light.</Tagline>
                </Hero>
                <Panel>
                    <Form>{content}</Form>
                </Panel>
            </Shell>
        </Layout>
    );

    if (!email || !token) {
        return shell(
            <>
                <Headline>That link isn't right.</Headline>
                <Subtext>This reset link is missing required information.</Subtext>
                <Meta>
                    <Link href="/forgot-password">Request a new link</Link>
                </Meta>
            </>
        );
    }

    if (done) {
        return shell(
            <>
                <Headline>Password updated.</Headline>
                <Subtext>You can now sign in with your new password.</Subtext>
                <Meta>
                    <Link href="/login">Go to sign in</Link>
                </Meta>
            </>
        );
    }

    return shell(
        <>
            <Headline>Set a new password.</Headline>
            <Subtext>Make it something you haven't used here before.</Subtext>
            <form onSubmit={handleSubmit}>
                <FieldStack>
                    <StyledTextField
                        label="New password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                    />
                    <StyledTextField
                        label="Confirm new password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        fullWidth
                    />
                    {error && <ErrorText>{error}</ErrorText>}
                    <SubmitButton type="submit" disabled={submitting}>
                        Reset password
                    </SubmitButton>
                </FieldStack>
            </form>
        </>
    );
}
export default ResetPassword;
