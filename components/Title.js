import Link from "next/link";
import Button from "@material-ui/core/Button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, projectFirestore } from "../firebase/config";

const Title = ({ userInfo }) => {
    const [user, loading] = useAuthState(auth);

    const showLogin = () => {
        if (user == null) {
            return (
                <Link href={"/login"}>
                    <Button
                        variant="contained"
                        component="span"
                        className="loginButton"
                    >
                        Login
                    </Button>
                </Link>
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
                    <h1>GalleryIO</h1>
                </Link>
                {showLogin()}
            </div>
            {userInfo ? (
                <h2>{userInfo.username}'s Photos</h2>
            ) : (
                <h2>The Gallery</h2>
            )}
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    );
};

export default Title;
