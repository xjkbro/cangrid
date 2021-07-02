import "../styles/globals.css";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, projectFirestore } from "../firebase/config";
import firebase from "firebase";

function MyApp({ Component, pageProps }) {
    const [user, loading] = useAuthState(auth);
    useEffect(() => {
        if (user) {
            projectFirestore.collection("users").doc(user.uid).set(
                {
                    name: user.displayName,
                    email: user.email,
                    lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                    photoURL: user.photoURL,
                },
                { merge: true }
            );
        }
    }, [user]);

    return <Component {...pageProps} />;
}

export default MyApp;
