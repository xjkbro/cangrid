import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
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
    const { userData } = useContext(UserContext);
    const user = userData?.user;
    const router = useRouter();
    const [error, setError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!error && username) {
            const res = await fetch("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });
            if (res.ok) {
                router.reload();
            } else {
                const body = await res.json().catch(() => ({}));
                setError(true);
            }
        }
    };
    const UsernameCheck = async (e) => {
        if (!e) return;
        const res = await fetch(
            `/api/users/username-check?username=${encodeURIComponent(e)}`
        );
        const { taken } = await res.json();
        setError(taken);
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
                        <label for="username">Username</label>
                    </span>
                    <span>
                        {username != ""
                            ? error
                                ? `❌${username} is not available!`
                                : `✔️ ${username} is available! :)`
                            : ""}
                    </span>
                </UsernameForm>
            </>
        );
    } else return <></>;
}
export default CreateUsername;
