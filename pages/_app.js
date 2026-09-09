import "../styles/globals.css";
import { useState, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { UserContext } from "../providers/UserContext";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";
const theme = {
    colors: {
        primary: "#89b0ae",
        secondary: "#555b6e",
        overlay: "#ffd6ba",
        error: "#ff4a4a",
        dark: "#253335",
    },
};

const Line = styled.div`
    width: 100vw;
    height: 6px;
    animation: animateBg 10s ease-in-out infinite;
    background-image: linear-gradient(
        100deg,
        #cdffd8,
        #94b9ff,
        #cdffd8
    );
    background-size: 300% 100%;
    @keyframes animateBg {
        0% {
            background-position: 0% 0%;
        }
        100% {
            background-position: 100% 0%;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

// Bridges next-auth's session into the old `{ userData: { user }, setUserData }`
// shape the rest of the app (Title, UploadForm, CreateUsername, Profile,
// index) already reads from UserContext, so ticket #3 doesn't have to touch
// every consumer's field names — those get fully rewired in ticket #5.
function UserContextBridge({ children }) {
    const { data: session } = useSession();
    const [userData, setUserData] = useState({ user: null });

    useEffect(() => {
        if (session?.user) {
            setUserData({
                user: {
                    uid: session.user.id,
                    email: session.user.email,
                    username: session.user.username,
                    displayName: session.user.displayName,
                    description: session.user.description,
                    nightMode: session.user.nightMode,
                    photoURL: session.user.photoURL,
                },
            });
        } else {
            setUserData({ user: null });
        }
    }, [session]);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    const [bgColor, setBGColor] = useState();
    const [textColor, setTextColor] = useState("#253335");
    const [nightMode, setNightMode] = useState();

    useEffect(() => {
        if (nightMode == "true") {
            setBGColor("#253335");
            setTextColor("#fff");
        }
        if (nightMode == "false") {
            setBGColor("#fff");
            setTextColor("#253335");
        }
        // Drives the --bg/--text/etc. tokens in globals.css (used by the
        // profile page, modal, and anything else built against the shared
        // token system) — additive to the bgColor/textColor props above,
        // which older components (Title) still read directly.
        if (nightMode != null) {
            document.documentElement.setAttribute(
                "data-theme",
                nightMode == "true" ? "dark" : "light"
            );
        }
    }, [nightMode, setNightMode]);

    useEffect(() => {
        // On Component Mount, set Night Mode from localStorage
        if (localStorage.getItem("nightMode") == null)
            localStorage.setItem("nightMode", false);

        setNightMode(localStorage.getItem("nightMode"));
    }, []);

    return (
        <SessionProvider session={session}>
            <UserContextBridge>
                <ThemeProvider theme={theme}>
                    <Line />
                    <Component
                        {...pageProps}
                        bgColor={bgColor}
                        nightMode={nightMode}
                        setNightMode={setNightMode}
                    />
                </ThemeProvider>
            </UserContextBridge>
        </SessionProvider>
    );
}

export default MyApp;
