import { useEffect } from "react";
import { auth } from "../firebase/config";
import { useRouter } from "next/router";

function SignOut() {
    const router = useRouter();
    useEffect(() => {
        auth.signOut();
        router.push("/");
    }, []);
    return <div></div>;
}
export default SignOut;
