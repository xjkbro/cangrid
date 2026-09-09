import { useEffect } from "react";
import { signOut } from "next-auth/react";

function SignOut() {
    useEffect(() => {
        signOut({ callbackUrl: "/" });
    }, []);
    return <></>;
}
export default SignOut;
