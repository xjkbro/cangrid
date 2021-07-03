import "../styles/globals.css";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, projectFirestore } from "../firebase/config";
import firebase from "firebase";
import { UserContext } from "../utils/UserContext";

function MyApp({ Component, pageProps }) {
    const [user, loading] = useAuthState(auth);
    const [userData, setUserData] = useState({
        id: "",
        name: "",
        username: "",
        email: "",
        photoURL: "",
    });
    useEffect(() => {
        if (user) {
            console.log(user);
            projectFirestore.collection("users").doc(user.uid).set(
                {
                    id: user.uid,
                    name: user.displayName,
                    username: "",
                    email: user.email,
                    photoURL: user.photoURL,
                },
                { merge: true }
            );
            setUserData({
                id: user.uid,
                name: user.displayName,
                username: user.username,
                email: user.email,
                photoURL: user.photoURL,
            });
            console.log(userData);
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            <Component {...pageProps} />
        </UserContext.Provider>
    );
}

export default MyApp;
