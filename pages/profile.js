import { useContext, useState, useEffect } from "react";
import Title from "../components/ProfileTitle";
import { UserContext } from "../providers/UserContext";
import { auth, updateUserDocument, getUsernameDoc } from "../firebase/config";
import { useRouter } from "next/router";
import CreateUsername from "../components/CreateUsername";
import Link from "next/link";

function Profile() {
    const router = useRouter();
    const { userData, setUserData } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionLimit, setDescriptionLimit] = useState(150);
    const [error, setError] = useState(false);
    const [toggleUsernameChange, setToggleUsernameChange] = useState(false);

    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(userData?.user);
        setUsername(userData?.user?.username);
        setDescription(userData?.user?.description);
        // setDescriptionLimit(
        //     descriptionLimit - userData?.user?.description.length
        // );
    }, [userData]);

    const changeUserFields = async (event) => {
        event.preventDefault();
        updateUserDocument(user, username, description);
        console.log(userData);
        const tempUser = { ...userData.user, username, description };
        console.log(tempUser);
        setUserData({ user: tempUser });
    };
    const UsernameCheck = async (e) => {
        let err = await getUsernameDoc(e);
        setError(await getUsernameDoc(e));
    };

    return (
        <div className="App">
            <Title />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {user?.username == null ? (
                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            boxShadow: "0px 10px 10px #bbb",
                            padding: "10vw",
                            backgroundColor: "#ddd",
                        }}
                    >
                        <h1 style={{ textAlign: "center" }}>
                            Please finish your profile
                        </h1>

                        <CreateUsername />
                    </div>
                ) : (
                    <div className="profileDiv" style={{ width: "75vw" }}>
                        <div
                            className="profileImg"
                            style={{
                                background: `url(${
                                    user?.photoURL ||
                                    "https://i.stack.imgur.com/l60Hf.png"
                                })  no-repeat center center`,
                                backgroundSize: "cover",
                                borderRadius: "50%",
                                height: "200px",
                                width: "200px",
                                margin: "10px",
                            }}
                        ></div>
                        <div style={{ width: "75%" }}>
                            <h2>Name: {user?.displayName}</h2>
                            <h3>
                                Username: {user.username}{" "}
                                <span
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
                                </span>
                            </h3>
                            {toggleUsernameChange ? (
                                <div
                                    style={{
                                        width: "90%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <input
                                        type="text"
                                        name="username"
                                        style={{ width: "74%" }}
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            UsernameCheck(e.target.value);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        style={{ width: "24%" }}
                                        onClick={changeUserFields}
                                    >
                                        Change Username
                                    </button>
                                    <p>
                                        {username != user.username &&
                                        username != ""
                                            ? error
                                                ? `${username} is not available!`
                                                : `${username} is available! :)`
                                            : ""}
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}

                            <h3>Email: {user?.email}</h3>
                            {console.log(user?.uid)}
                            {/* <h3>ID: {user?.uid}</h3> */}
                            {/* <Link href={`/users/${user?.uid}`}>
                                <h3>View Your Gallery</h3>
                            </Link> */}
                            <h3>Profile Description: </h3>
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
                                    if (
                                        e.target.value.length < descriptionLimit
                                    ) {
                                        let val =
                                            description?.length -
                                            e.target.value.length;
                                        setDescription(e.target.value);
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
                )}
            </div>
        </div>
    );
}

export default Profile;
