import { useEffect, useContext } from "react";
import { auth } from "../firebase/config";
import { useRouter } from "next/router";
import { UserContext } from "../providers/UserContext";

function SignOut() {
    const router = useRouter();
    const { setUserData } = useContext(UserContext);
    useEffect(() => {
        auth.signOut();
        setUserData(null);
        router.push("/");
    }, []);
    return <></>;
}
export default SignOut;
