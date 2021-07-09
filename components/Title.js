import Link from "next/link";
import Head from "next/head";
import Button from "@material-ui/core/Button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider, projectFirestore } from "../firebase/config";
import { UserContext } from "../providers/UserContext";
import { useRouter } from "next/router";
import { useContext } from "react";

const Title = ({ userInfo, isError }) => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const { userData, setUserData } = useContext(UserContext);

    const signIn = () => {
        auth.signInWithPopup(provider)
            .then((res) => {
                console.log(res);
                if (res.additionalUserInfo.isNewUser) router.push("/profile");
                else {
                    router.push(`/`);
                }
            })
            .catch(alert);
    };

    const showLogin = () => {
        if (user == null) {
            return (
                <>
                    <Button
                        variant="contained"
                        component="span"
                        className="loginButton"
                        onClick={signIn}
                    >
                        Login
                    </Button>
                </>
            );
        } else {
            return (
                <div className="control">
                    {/* <Link href={`/users/${user.uid}`}> */}
                    <Link href={`/users/${userData?.user?.username}`}>
                        <Button
                            variant="contained"
                            component="span"
                            className="profileButton"
                        >
                            Your Gallery
                        </Button>
                    </Link>
                    <Link href={"/profile"}>
                        <Button
                            variant="contained"
                            component="span"
                            className="profileButton"
                        >
                            Profile
                        </Button>
                    </Link>
                    <Link href={"/signout"}>
                        <Button
                            variant="contained"
                            component="span"
                            className="logoutButton"
                        >
                            Logout
                        </Button>
                    </Link>
                </div>
            );
        }
    };

    const TitleDisplay = () => {
        if (userInfo && !isError) {
            return (
                <>
                    <h2>{userInfo.username}'s Gallery</h2>
                    <p>{userInfo.description}</p>
                </>
            );
        } else if (isError) {
            return (
                <>
                    <h2>Something Went Wrong</h2>
                    {/* <p></p> */}
                </>
            );
        } else {
            return (
                <>
                    <h2>The Gallery</h2>
                    <p>
                        Welcome to the Gallery. Please sign in to continue and
                        upload your art.
                    </p>
                </>
            );
        }
    };
    return (
        <div className="title">
            <Head>
                {userInfo ? (
                    <title>{userInfo.username} | GalleryIO</title>
                ) : (
                    <title> GalleryIO</title>
                )}
            </Head>
            <div className="title-bar">
                <Link href={"/"}>
                    <h1 style={{ cursor: "pointer" }}>GalleryIO</h1>
                </Link>
                {showLogin()}
            </div>
            {TitleDisplay()}
        </div>
    );
};

export default Title;
