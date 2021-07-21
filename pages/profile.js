import { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import { UserContext } from "../providers/UserContext";
import { auth, updateUserDocument, getUsernameDoc } from "../firebase/config";
import { useRouter } from "next/router";
import CreateUsername from "../components/CreateUsername";
import Link from "next/link";
import styled from "styled-components";

const ProfileContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
const ProfileBackDrop = styled.div`
    /* display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center; */
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0px 10px 10px #bbb;
    /* padding: 10vw; */
    padding: 20px;
    background-color: #ddd;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
`;
const ProfileImage = styled.div`
    background: url(${(props) => props.user?.photoURL}) no-repeat center center;
    background-size: cover;
    border-radius: 50%;
    height: 200px;
    width: 200px;
    margin: 10px auto;
`;
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
function Profile() {
    const router = useRouter();
    const { userData, setUserData } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionLimit, setDescriptionLimit] = useState(150);
    const [usernameLength, setUsernameLength] = useState(20);
    const [error, setError] = useState(false);
    const [toggleUsernameChange, setToggleUsernameChange] = useState(false);

    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(userData?.user);
        setUsername(userData?.user?.username);
        setDescription(userData?.user?.description);
    }, [userData]);

    const changeUserFields = async (event) => {
        event.preventDefault();
        if (!error) {
            updateUserDocument(user, username, description);
            console.log(userData);
            const tempUser = { ...userData.user, username, description };
            console.log(tempUser);
            setUserData({ user: tempUser });
        }
    };
    const UsernameCheck = async (e) => {
        let err = await getUsernameDoc(e);
        setError(await getUsernameDoc(e));
    };

    return (
        <div className="App">
            <Title />
            <ProfileContainer>
                {user?.username == null ? (
                    <ProfileBackDrop>
                        <h1 style={{ textAlign: "center" }}>
                            Please finish your profile
                        </h1>

                        <CreateUsername />
                    </ProfileBackDrop>
                ) : (
                    <ProfileBackDrop style={{ width: "75vw" }}>
                        {/* <h1>Profile</h1> */}
                        <div>
                            <ProfileImage
                                user={user}
                                // style={{
                                //     background: `url(${
                                //         user?.photoURL ||
                                //         "https://i.stack.imgur.com/l60Hf.png"
                                //     })  no-repeat center center`,
                                // }}
                            />
                            <div style={{ textAlign: "center" }}>
                                To change profile image, change your Google
                                Account's profile image and log back in.
                            </div>
                        </div>
                        <div>
                            <div style={{ width: "75%" }}>
                                <h4>Name: {user?.displayName}</h4>
                                <h4>
                                    Username: {user?.username}{" "}
                                    <div
                                        style={{
                                            cursor: "pointer",
                                            fontSize: "12px",
                                            marginLeft: "10px",
                                        }}
                                        onClick={() =>
                                            setToggleUsernameChange(
                                                !toggleUsernameChange
                                            )
                                        }
                                    >
                                        Change Username
                                    </div>
                                </h4>
                                {toggleUsernameChange ? (
                                    <UsernameForm onSubmit={changeUserFields}>
                                        <span>
                                            <input
                                                type="text"
                                                name="username"
                                                style={{
                                                    padding: "5px",
                                                    marginLeft: "10px",
                                                }}
                                                value={username}
                                                // onChange={(e) => {
                                                //     setUsername(e.target.value);
                                                //     UsernameCheck(e.target.value);
                                                // }}
                                                onChange={(e) => {
                                                    if (
                                                        e.target.value.length <
                                                        usernameLength
                                                    ) {
                                                        let val =
                                                            username?.length -
                                                            e.target.value
                                                                .length;
                                                        setUsername(
                                                            e.target.value
                                                        );
                                                        UsernameCheck(
                                                            e.target.value
                                                        );
                                                    } else {
                                                        setUsername(username);
                                                        UsernameCheck(
                                                            e.target.value
                                                        );
                                                    }
                                                }}
                                            />
                                            <label for="username">
                                                Username
                                            </label>
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
                                ) : (
                                    <></>
                                )}

                                <h4>Email: {user?.email}</h4>
                                {console.log(user?.uid)}
                                {/* <h3>ID: {user?.uid}</h3> */}
                                {/* <Link href={`/users/${user?.uid}`}>
                                <h3>View Your Gallery</h3>
                            </Link> */}
                                <h4>Profile Description: </h4>
                                <textarea
                                    type="text"
                                    name="description"
                                    style={{
                                        fontSize: "14px",
                                        width: "100%",
                                        height: "100px",
                                        resize: "none",
                                    }}
                                    value={description}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 150) {
                                            let val =
                                                description?.length -
                                                e.target.value.length;
                                            setDescription(e.target.value);
                                            setDescriptionLimit(
                                                descriptionLimit + val
                                            );
                                        } else {
                                            setDescription(description);
                                        }
                                    }}
                                />
                                <div>Character Limit: {descriptionLimit}</div>
                            </div>
                            <button type="button" onClick={changeUserFields}>
                                Save
                            </button>
                        </div>
                    </ProfileBackDrop>
                )}
            </ProfileContainer>
        </div>
    );
}

export default Profile;
