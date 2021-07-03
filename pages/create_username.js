import { useEffect, useState, useContext } from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import { auth, provider, projectFirestore } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import firebase from "firebase";
import { UserContext } from "../utils/UserContext";

function CreateUsername() {
    const [username, setUsername] = useState(null);
    const { userData, setUserData } = useContext(UserContext);
    const [user, loading] = useAuthState(auth);
    console.log(userData);
    console.log(user);
    const router = useRouter();
    console.log(username);

    const handleSubmit = (event) => {
        // alert("A name was submitted: " + username);
        setUserData({ ...userData, username });
        console.log(userData);

        event.preventDefault();
        router.push("/");
    };

    useEffect(() => {
        if (user) {
            projectFirestore.collection("users").doc(user.uid).set(
                {
                    id: user.uid,
                    name: user.displayName,
                    username,
                    email: user.email,
                    photoURL: user.photoURL,
                },
                { merge: true }
            );
        }
    }, [userData]);

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input type="submit" value="Submit" />
            </form>
        </Container>
    );
}
export default CreateUsername;
const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    /* background-color: #495057; */
`;
