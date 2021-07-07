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
    const [error, setError] = useState(false);

    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(userData?.user);
        setUsername(userData?.user?.username);
        setDescription(userData?.user?.description);
    }, [userData]);

    const changeUsername = async (event) => {
        event.preventDefault();
        updateUserDocument(user, username, description);
        console.log(userData);
        const tempUser = { ...userData.user, username, description };
        console.log(tempUser);
        setUserData({ user: tempUser });
    };

    const changeDescription = async (event) => {
        event.preventDefault();
        updateUserDocument(user, username, description);
        console.log(userData);
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
                    <div className="profileDiv">
                        <div
                            className="profileImg"
                            style={{
                                background: `url(${
                                    user?.photoURL ||
                                    "https://i.stack.imgur.com/l60Hf.png"
                                })  no-repeat center center`,
                                backgroundSize: "contain",
                                height: "200px",
                                width: "200px",
                                margin: "10px",
                            }}
                        ></div>
                        <div>
                            <h2>Display Name: {user?.displayName}</h2>
                            <h3>Username: {user.username}</h3>
                            <div>
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        UsernameCheck(e.target.value);
                                    }}
                                />
                                <button type="button" onClick={changeUsername}>
                                    Change Username
                                </button>
                                <p>
                                    {username}{" "}
                                    {username != user.username
                                        ? error
                                            ? "is not available!"
                                            : "is available! :)"
                                        : "is your current username"}
                                </p>
                            </div>

                            <h3>Email: {user?.email}</h3>
                            <h3>ID: {user?.uid}</h3>
                            <a href={`/users/${user?.uid}`}>
                                <h3>View Your Gallery</h3>
                            </a>
                            <h3>
                                Profile Description:{" "}
                                <textarea
                                    type="text"
                                    name="username"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />
                                <button type="button" onClick={changeUsername}>
                                    Save
                                </button>
                            </h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
