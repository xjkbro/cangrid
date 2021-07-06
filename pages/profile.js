import { useContext, useState, useEffect } from "react";
import Title from "../components/ProfileTitle";
import { UserContext } from "../providers/UserContext";
import { auth } from "../firebase/config";
import { useRouter } from "next/router";
import CreateUsername from "../components/CreateUsername";
import Link from "next/link";

function Profile() {
    const router = useRouter();
    const { userData } = useContext(UserContext);

    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(userData?.user);
    }, [userData]);
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
                    <div>
                        <h1>Please finish Profile</h1>

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
                            <h3>Username: {user?.username}</h3>
                            <h3>Email: {user?.email}</h3>
                            <h3>ID: {user?.uid}</h3>
                            <a href={`/users/${user?.uid}`}>
                                <h3>View Your Gallery</h3>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
