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

export default function SingleUser({ userInfo, imgs }) {
    const [selectedImg, setSelectedImg] = useState(null);
    const [user, loading] = useAuthState(auth);
    const { userData, setUserData } = useContext(UserContext);

    console.log(userInfo);
    console.log(imgs);
    return (
        <div className="App">
            <Title />
            <UploadForm />
            <ImageGrid setSelectedImg={setSelectedImg} />
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
    let ref = projectFirestore.collection("users").doc(context.query.id);
    // console.log(context.query.id);
    const imgRes = await ref
        .collection("images")
        .orderBy("createdAt", "asc")
        .get();

    const imgs = imgRes.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        .map((img) => ({ url: img.url }));
    const userRes = await ref.get();
    const userInfo = { id: userRes.id, ...userRes.data() };

    return {
        props: {
            userInfo,
            imgs,
        },
    };
}
