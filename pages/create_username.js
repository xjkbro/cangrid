import { useEffect, useState, useContext } from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import {
    auth,
    provider,
    projectFirestore,
    generateUserDocument,
} from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import firebase from "firebase";
import { UserContext } from "../providers/UserContext";

function CreateUsername() {
    const [username, setUsername] = useState("");
    const { userData, setUserData } = useContext(UserContext);
    // const [user, loading] = useAuthState(auth);
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    const handleSubmit = async (event) => {
        console.log(user);
        console.log(username);
        // alert("A name was submitted: " + username);
        // const {user} = await auth.createUserWithEmailAndPassword(email, password);
        generateUserDocument(user, username);
        // setUserData({ ...userData, username });
        console.log(userData);
        event.preventDefault();
        router.push("/");
    };

    // useEffect(() => {
    //     if (user) {
    //         projectFirestore.collection("users").doc(user.uid).set(
    //             {
    //                 id: user.uid,
    //                 name: user.displayName,
    //                 username,
    //                 email: user.email,
    //                 photoURL: user.photoURL,
    //             },
    //             { merge: true }
    //         );
    //     }
    // }, [userData]);
    if (user) {
        return (
            <Container>
                <form>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button type="button" onClick={handleSubmit}>
                        Submit
                    </button>
                </form>
            </Container>
        );
    } else return <></>;
}
export default CreateUsername;
const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    /* background-color: #495057; */
`;
