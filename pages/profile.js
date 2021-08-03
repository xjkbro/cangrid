import { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import { UserContext } from "../providers/UserContext";
import { auth, updateUserDocument, getUsernameDoc } from "../firebase/config";
import { useRouter } from "next/router";
import CreateUsername from "../components/CreateUsername";
import Link from "next/link";
import styled from "styled-components";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";

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
    box-shadow: 5px 5px 10px #333;
    /* padding: 10vw; */
    padding: 20px;
    background-color: #ddd;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;

    @media (min-width: 768px) {
        grid-gap: 40px;
        grid-template-columns: 1fr 1fr;
        height: 500px;
    }
`;
const UsernameBackdrop = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #333;
    /* padding: 10vw; */
    padding: 0 50px;
    background-color: #ddd;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;
    height: 500px;
    > p {
        padding: 0 30px;
    }
    > form > span > input {
        width: 100%;
    }
    > form > span {
        display: flex;
        justify-content: center;
    }
    @media (min-width: 768px) {
        grid-gap: 10px;
        grid-template-columns: 1fr;
        height: 500px;
    }
`;
const ProfileImage = styled.div`
    background: url(${(props) => props.user?.photoURL}) no-repeat center center;
    background-size: cover;
    border-radius: 50%;
    height: 50vw;
    width: 50vw;
    margin: 10px auto;
    @media (min-width: 768px) {
        height: 200px;
        width: 200px;
    }
`;
const UsernameForm = styled.form`
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    width: 100%;
    > span > input {
        position: relative;
        font-family: inherit;
        width: 90%;
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
    @media (min-width: 768px) {
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
    }
`;
const ProfileDescription = styled(TextField)`
    position: relative;

    /* position: absolute;
    bottom: 0px;*/
    margin: 10px auto;
    left: 10px;
    width: 95%;
`;
const SaveContainer = styled.div`
    height: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const SaveButton = styled(Button)`
    position: relative;
    background-color: ${(props) => props.theme.colors.primary} !important;
    .MuiButton-label {
        color: white;
    }
    @media (min-width: 768px) {
        /* left: 0; */
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

    const [bgColor, setBGColor] = useState("#fff");
    const [nightMode, setNightMode] = useState(userData?.user?.nightMode);
    useEffect(() => {
        setUser(userData?.user);
        setUsername(userData?.user?.username);
        setDescription(userData?.user?.description);
        setNightMode(userData?.user?.nightMode);
    }, [userData]);
    useEffect(() => {
        if (nightMode == true) setBGColor("#253335");
        else setBGColor("#fff");
    }, [nightMode]);

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
            <Title bgColor={bgColor} setNightMode={setNightMode} />
            <ProfileContainer>
                {user?.username == null ? (
                    <UsernameBackdrop>
                        <h1 style={{ textAlign: "center" }}>
                            Please finish your profile
                        </h1>

                        <CreateUsername />
                    </UsernameBackdrop>
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
                        <div style={{ height: "100%" }}>
                            <div
                                style={{
                                    position: "relative",
                                    // height: "350px",
                                    width: "100%",
                                }}
                            >
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

                                <ProfileDescription
                                    id="outlined-multiline-static"
                                    multiline
                                    rows={2}
                                    label="Description"
                                    variant="outlined"
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
                                <div
                                    style={{
                                        position: "absolute",
                                        right: "20px",
                                    }}
                                >
                                    Character Limit: {descriptionLimit}
                                </div>
                            </div>
                            <SaveContainer>
                                <SaveButton
                                    variant="contained"
                                    color="#fff"
                                    component="span"
                                    onClick={changeUserFields}
                                >
                                    Save
                                </SaveButton>
                            </SaveContainer>
                        </div>
                    </ProfileBackDrop>
                )}
            </ProfileContainer>
            <style jsx global>
                {`
                html {
                    background-color: ${bgColor};
            `}
            </style>
        </div>
    );
}

export default Profile;
