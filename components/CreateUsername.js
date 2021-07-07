import { useEffect, useState, useContext } from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import {
    auth,
    provider,
    projectFirestore,
    generateUserDocument,
    getUsernameDoc,
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
    const [error, setError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (error) {
            console.log("TRY ANOTHER");
        } else {
            generateUserDocument(user, username);
            console.log(userData);

            auth.signOut();

            router.push(`users/${userData.user.uid}`);
        }
    };

    const UsernameCheck = async (e) => {
        let err = await getUsernameDoc(e);
        setError(await getUsernameDoc(e));
    };

    if (user) {
        return (
            <>
                <p>
                    You may need to sign out after creating a username. Please
                    sign back in to finish your profile.
                </p>
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            style={{ padding: "5px", marginLeft: "10px" }}
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                UsernameCheck(e.target.value);
                            }}
                        />
                        <button type="button" onClick={handleSubmit}>
                            Submit
                        </button>
                    </label>
                    <div>
                        <p>
                            {username}{" "}
                            {username != ""
                                ? error
                                    ? "is not available!"
                                    : "is available! :)"
                                : ""}
                        </p>
                    </div>
                    {/* <input type="submit" value="Submit" /> */}
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
