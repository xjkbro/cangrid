import { useState, useEffect } from "react";
import Title from "../../components/Title";
import UploadForm from "../../components/UploadForm";
import ImageGrid from "../../components/ImageGrid";
import UniversalGrid from "../../components/UniversalGrid";
import Modal from "../../components/Modal";

import { auth, projectFirestore } from "../../firebase/config";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import { useRouter } from "next/router";

export default function SingleUser({ userData }) {
    const [selectedImg, setSelectedImg] = useState(null);
    const [user, loading] = useAuthState(auth);
    console.log(userData);
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
    console.log(context.query.id + "asdasd");
    const userRes = await ref.get();
    // const user = {
    //     id: userRes.id,
    //     name: JSON.stringify(userRes.name),
    // };
    return {
        props: {
            userData: userRes.id,
        },
    };
}
