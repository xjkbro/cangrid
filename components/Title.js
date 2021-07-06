import Link from "next/link";
import Head from "next/head";
import Button from "@material-ui/core/Button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider, projectFirestore } from "../firebase/config";
import { useRouter } from "next/router";

const Title = ({ userInfo }) => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    const signIn = () => {
        auth.signInWithPopup(provider)
            .then((res) => {
                console.log(res);
                if (res.additionalUserInfo.isNewUser) router.push("/profile");
                else router.push(`/users/${res.user.uid}`);
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
                    <Link href={`/users/${user.uid}`}>
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
            {userInfo ? (
                <>
                    <h2>{userInfo.username}'s Photos</h2>
                    <p>{userInfo.description}</p>
                </>
            ) : (
                <>
                    <h2>The Gallery</h2>
                    <p>
                        Welcome to the Gallery. Please sign in or sign up to
                        continue and upload your art.
                    </p>
                </>
            )}
        </div>
    );
};

export default Title;
