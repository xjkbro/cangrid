import "../styles/globals.css";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
    auth,
    projectFirestore,
    generateUserDocument,
} from "../firebase/config";
import firebase from "firebase";
import { UserContext } from "../providers/UserContext";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";
const theme = {
    colors: {
        primary: "#333",
    },
};

const Line = styled.div`
    width: 100%;
    height: 10px;
    background: linear-gradient(
        270deg,
        #b0ae89 25.28%,
        #89b0ae 59.7%,
        #ad89b0 97.75%
    );
`;
function MyApp({ Component, pageProps }) {
    const [user, loading] = useAuthState(auth);
    const [userData, setUserData] = useState({ user: null });

    // useEffect(() => {
    //     if (user) {
    //         console.log(user);
    //         projectFirestore.collection("users").doc(user.uid).set(
    //             {
    //                 id: user.uid,
    //                 name: user.displayName,
    //                 email: user.email,
    //                 photoURL: user.photoURL,
    //             },
    //             { merge: true }
    //         );
    //     }
    // }, [user]);
    useEffect(async () => {
        console.log("hello");
        auth.onAuthStateChanged(async (userAuth) => {
            const user = await generateUserDocument(userAuth);
            setUserData({ user });
        });
    }, []);
    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            <ThemeProvider theme={theme}>
                <Line />
                <Component {...pageProps} />
            </ThemeProvider>
        </UserContext.Provider>
    );
}

export default MyApp;
