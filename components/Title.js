import Link from "next/link";
import Button from "@material-ui/core/Button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, projectFirestore } from "../firebase/config";

const Title = () => {
    const [user, loading] = useAuthState(auth);
    console.log(user);

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
                <Link href={"/signout"}>
                    <Button
                        variant="contained"
                        component="span"
                        className="loginButton"
                    >
                        Logout
                    </Button>
                </Link>
            );
        }
    };
    return (
        <div className="title">
            <div className="title-bar">
                <h1>GalleryIO</h1>
                {showLogin()}
            </div>
            <h2>Jason-Kyle De Lara's Photos</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    );
};

export default Title;
