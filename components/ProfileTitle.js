import Link from "next/link";
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
                router.push("/profile");
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
            <div className="title-bar">
                <Link href={"/"}>
                    <h1 style={{ cursor: "pointer" }}>GalleryIO</h1>
                </Link>
                {showLogin()}
            </div>
            <h2>Profile</h2>
            {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> */}
        </div>
    );
};

export default Title;
