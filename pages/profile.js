import { useContext, useState, useEffect } from "react";
import { UserContext } from "../providers/UserContext";
import { auth } from "../firebase/config";
import { useRouter } from "next/router";

function Profile() {
    const router = useRouter();
    const { userData } = useContext(UserContext);

    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(userData.user);
    }, [userData]);
    return (
        <div>
            <div>
                <div
                    style={{
                        background: `url(${
                            user?.photoURL ||
                            "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
                        })  no-repeat center center`,
                        backgroundSize: "cover",
                        height: "200px",
                        width: "200px",
                    }}
                    className="border border-blue-300"
                ></div>
                <div className="md:pl-4">
                    <h2 className="text-2xl font-semibold">
                        {user?.displayName}
                    </h2>
                    <h3 className="italic">{user?.email}</h3>
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
