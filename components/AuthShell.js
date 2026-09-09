import styled, { keyframes, css } from "styled-components";
import { TextField } from "@material-ui/core";

// Shared shell for every auth page (login, forgot-password, reset-password).
// One bold moment — the aperture panel — everything else stays quiet.

const iris = keyframes`
    from {
        opacity: 0;
        transform: scale(0.72) rotate(-18deg);
    }
    to {
        opacity: 1;
        transform: scale(1) rotate(0deg);
    }
`;

export const Shell = styled.div`
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 240px 1fr;
    background: #f7fbf9;

    @media (min-width: 900px) {
        grid-template-columns: minmax(360px, 42%) 1fr;
        grid-template-rows: 1fr;
    }
`;

export const Hero = styled.div`
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 28px 32px;
    background: linear-gradient(160deg, #cdffd8 0%, #94b9ff 100%);

    @media (min-width: 900px) {
        padding: 48px;
    }
`;

export const Wordmark = styled.span`
    font-family: "Nunito", sans-serif;
    font-weight: 800;
    font-size: 1.15rem;
    letter-spacing: 0.01em;
    color: #f7fbf9;
    position: relative;
    z-index: 1;
`;

export const Tagline = styled.p`
    font-family: "Noto Serif", serif;
    font-size: 1.05rem;
    line-height: 1.5;
    max-width: 30ch;
    color: #1e2b2a;
    margin: 0;
    position: relative;
    z-index: 1;

    @media (min-width: 900px) {
        font-size: 1.35rem;
        max-width: 22ch;
    }
`;

const ApertureWrap = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    svg {
        width: 340px;
        height: 340px;
        animation: ${iris} 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @media (min-width: 900px) {
        svg {
            width: 480px;
            height: 480px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        svg {
            animation: none;
        }
    }
`;

// Echoes the 6-blade iris already sitting on the "i" in the Cangrid
// wordmark, scaled up as the page's one decorative moment.
export function Aperture() {
    const blades = Array.from({ length: 6 });
    return (
        <ApertureWrap aria-hidden="true">
            <svg viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="92" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
                <circle cx="100" cy="100" r="70" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1" />
                <circle cx="100" cy="100" r="46" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1" />
                {blades.map((_, i) => (
                    <line
                        key={i}
                        x1="100"
                        y1="100"
                        x2="100"
                        y2="8"
                        stroke="#ffffff"
                        strokeOpacity="0.5"
                        strokeWidth="1.5"
                        transform={`rotate(${i * 60} 100 100)`}
                    />
                ))}
                <circle cx="100" cy="100" r="22" fill="#f7fbf9" fillOpacity="0.9" />
            </svg>
        </ApertureWrap>
    );
}

export const Panel = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px 64px;

    @media (min-width: 900px) {
        padding: 48px;
    }
`;

export const Form = styled.div`
    width: 100%;
    max-width: 320px;
`;

export const Mark = styled.img`
    height: 22px;
    width: auto;
    margin-bottom: 28px;
    display: block;
`;

export const Headline = styled.h1`
    font-family: "Noto Serif", serif;
    font-weight: 700;
    font-size: 1.75rem;
    color: #1e2b2a;
    margin: 0 0 8px;
`;

export const Subtext = styled.p`
    font-family: "Nunito", sans-serif;
    font-size: 0.95rem;
    color: #5b6b72;
    margin: 0 0 28px;
    line-height: 1.5;
`;

export const FieldStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

export const ErrorText = styled.p`
    font-family: "Nunito", sans-serif;
    font-size: 0.875rem;
    color: #c23b3b;
    margin: 0;
`;

export const InfoText = styled.p`
    font-family: "Nunito", sans-serif;
    font-size: 0.875rem;
    color: #2e7d5c;
    margin: 0;
`;

export const SubmitButton = styled.button`
    font-family: "Nunito", sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    color: #f7fbf9;
    background-color: #4a7c79;
    border: none;
    border-radius: 8px;
    padding: 13px 20px;
    cursor: pointer;
    transition: background-color 150ms ease;

    &:hover {
        background-color: #3d6764;
    }
    &:disabled {
        background-color: #9db3b1;
        cursor: default;
    }
`;

export const Meta = styled.div`
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-family: "Nunito", sans-serif;
    font-size: 0.875rem;
    color: #5b6b72;

    a {
        color: #3d6764;
        font-weight: 700;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
`;

// MUI v4's class names (MuiInput-underline, Mui-focused, etc.) are stable,
// unhashed globals — safe to target directly to retint the default blue
// focus/underline to the brand teal instead of overriding via JSS classes.
export const StyledTextField = styled(TextField)`
    font-family: "Nunito", sans-serif;

    .MuiInputLabel-root {
        font-family: "Nunito", sans-serif;
        color: #5b6b72;
    }
    .MuiInputLabel-root.Mui-focused {
        color: #3d6764;
    }
    .MuiInput-underline:before {
        border-bottom-color: #d7e4e2;
    }
    .MuiInput-underline:hover:not(.Mui-disabled):before {
        border-bottom-color: #9db3b1;
    }
    .MuiInput-underline:after {
        border-bottom-color: #3d6764;
    }
    .MuiInputBase-input {
        font-family: "Nunito", sans-serif;
        color: #1e2b2a;
    }
`;

export const ToggleText = styled.button.attrs({ type: "button" })`
    font-family: "Nunito", sans-serif;
    font-size: inherit;
    cursor: pointer;
    color: #3d6764;
    font-weight: 700;
    background: none;
    border: none;
    padding: 0;

    &:hover {
        text-decoration: underline;
    }
`;
