import { useState, useEffect, useContext } from "react";
import Title from "../../components/Title";
import UploadForm from "../../components/UploadForm";
import ImageGrid from "../../components/ImageGrid";
import UniversalGrid from "../../components/UniversalGrid";
import Modal from "../../components/Modal";

import { auth, projectFirestore } from "../../firebase/config";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import { useRouter } from "next/router";
import { UserContext } from "../../providers/UserContext";

export default function SingleUser({ userInfo, images }) {
    const [selectedImg, setSelectedImg] = useState(null);
    const [user, loading] = useAuthState(auth);
    const { userData, setUserData } = useContext(UserContext);

    console.log(userInfo);
    console.log(user);
    return (
        <div className="App">
            <Title userInfo={userInfo} />
            {userInfo?.id == user?.uid ? <UploadForm /> : <></>}
            <ImageGrid images={images} setSelectedImg={setSelectedImg} />
            {selectedImg && (
                <Modal
                    selectedImg={selectedImg}
                    setSelectedImg={setSelectedImg}
                />
            )}
        </div>
    );
}
export async function getServerSideProps(context) {
    let collectionRef = projectFirestore.collection("users");
    let userRef = null;
    var query = await collectionRef
        .where("username", "==", context.query.username)
        .limit(1)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                userRef = doc.ref;
                console.log(doc.id, " => ", doc.data());
            });
        });
    console.log(query);
    if (userRef == undefined)
        return {
            redirect: {
                permanent: false,
                destination: "/users/404",
            },
            props: {},
        };
    // let userRef = projectFirestore.collection("users").doc(context.query.username);

    // console.log(context.query.username);
    // console.log(query);

    // console.log(userRef);

    const imgRes = await userRef.collection("images").get();

    // console.log(imgRes);

    const images = imgRes.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        .map((img) => {
            console.log(img);
            return {
                id: img.id,
                caption: img.caption,
                url: img.url,
                userData: img.userData,
            };
        });
    const userRes = await userRef.get();
    const userInfo = { id: userRes.id, ...userRes.data() };

    return {
        props: {
            userInfo,
            images,
        },
    };
}
