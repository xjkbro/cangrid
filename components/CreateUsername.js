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

const UsernameForm = styled.form`
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    width: 100%;
    > span > input {
        font-family: inherit;
        width: 300px;
        border: 0;
        border-bottom: 2px solid #9b9b9b;
        outline: 0;
        font-size: 1.3rem;
        color: ${(props) => props.theme.colors.secondary};
        padding: 7px 0;
        background: transparent;
        transition: border-color 0.2s;
    }
    > span > input::placeholder {
        color: transparent;
    }
    > span > input:focus {
        padding-bottom: 6px;
        font-weight: 700;
        border-width: 3px;
        /* border-image: linear-gradient(to right, #11998e, #38ef7d); */
        border-image: ${(props) => props.theme.colors.secondary};
        border-image-slice: 1;
    }
    > span > input:focus ~ label {
        position: absolute;
        top: 0;
        display: block;
        transition: 0.2s;
        font-size: 1rem;
        color: #11998e;
        font-weight: 700;
    }
    > span > label > button {
        background-color: #061922;
        padding: 10px;
    }
    > span > label {
        position: absolute;
        top: 0;

        left: 10px;
        display: block;
        transition: 0.2s;
        font-size: 1rem;
        color: #9b9b9b;
    }
`;
function CreateUsername() {
    const [username, setUsername] = useState("");
    const [usernameLength, setUsernameLength] = useState(20);
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

            router.push(`/`);
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
                <UsernameForm onSubmit={handleSubmit}>
                    <span>
                        <input
                            type="text"
                            name="username"
                            style={{ padding: "5px", marginLeft: "10px" }}
                            value={username}
                            // onChange={(e) => {
                            //     setUsername(e.target.value);
                            //     UsernameCheck(e.target.value);
                            // }}
                            onChange={(e) => {
                                if (e.target.value.length < usernameLength) {
                                    let val =
                                        username?.length -
                                        e.target.value.length;
                                    setUsername(e.target.value);
                                    UsernameCheck(e.target.value);
                                } else {
                                    setUsername(username);
                                    UsernameCheck(e.target.value);
                                }
                            }}
                        />
                        {/* <button type="button" onClick={handleSubmit}>
                        Submit
                    </button> */}
                        <label for="username">Username</label>
                    </span>
                    <span>
                        {username != ""
                            ? error
                                ? `❌${username} is not available!`
                                : `✔️ ${username} is available! :)`
                            : ""}
                    </span>
                    {/* <input type="submit" value="Submit" /> */}
                </UsernameForm>
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
