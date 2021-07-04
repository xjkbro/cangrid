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
            <Component {...pageProps} />
        </UserContext.Provider>
    );
}

export default MyApp;
