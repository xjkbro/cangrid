import { useState } from "react";
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
    InfoText,
    SubmitButton,
    Meta,
    StyledTextField,
} from "../components/AuthShell";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const res = await fetch("/api/auth/request-password-reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const body = await res.json();
        setSubmitting(false);
        setMessage(body.message || "If an account with that email exists, a reset link is on its way.");
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
                        <Headline>Reset your password.</Headline>
                        <Subtext>
                            Tell us the email on your account and we'll send a
                            link to set a new password.
                        </Subtext>
                        {message ? (
                            <InfoText>{message}</InfoText>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <FieldStack>
                                    <StyledTextField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        fullWidth
                                    />
                                    <SubmitButton type="submit" disabled={submitting}>
                                        Send reset link
                                    </SubmitButton>
                                </FieldStack>
                            </form>
                        )}
                        <Meta>
                            <Link href="/login">Back to sign in</Link>
                        </Meta>
                    </Form>
                </Panel>
            </Shell>
        </Layout>
    );
}
export default ForgotPassword;
