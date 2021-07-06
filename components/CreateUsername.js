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
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        generateUserDocument(user, username);
        console.log(userData);

        router.push("/");
    };

    if (user) {
        return (
            <>
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
            </>
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
