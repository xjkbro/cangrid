import { useContext, useEffect } from "react";
import { UserContext } from "../providers/UserContext";
import { auth } from "../firebase/config";
import { useRouter } from "next/router";

function Profile() {
    const router = useRouter();

    const { userData } = useContext(UserContext);
    console.log(userData);
    const { uid, photoURL, displayName, email } = userData;
    useEffect(() => {}, [userData]);
    return (
        <div>
            <div>
                <div
                    style={{
                        background: `url(${
                            photoURL ||
                            "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
                        })  no-repeat center center`,
                        backgroundSize: "cover",
                        height: "200px",
                        width: "200px",
                    }}
                    className="border border-blue-300"
                ></div>
                <div className="md:pl-4">
                    <h2 className="text-2xl font-semibold">{displayName}</h2>
                    <h3 className="italic">{email}</h3>
                </div>
            </div>
            <button
                className="w-full py-3 bg-red-600 mt-4 text-white"
                onClick={() => {
                    auth.signOut();
                    router.push("/");
                }}
            >
                Sign out
            </button>
        </div>
    );
}

export default Profile;
