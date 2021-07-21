import { useState, useEffect, useContext } from "react";
import Title from "../../components/Title";
import UploadForm from "../../components/UploadForm";
import ImageGrid from "../../components/TagGrid";
import UniversalGrid from "../../components/UniversalGrid";
import Modal from "../../components/Modal";

import { auth, projectFirestore } from "../../firebase/config";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import { useRouter } from "next/router";
import { UserContext } from "../../providers/UserContext";

export default function SingleUser({ images }) {
    const router = useRouter();
    const [selectedImg, setSelectedImg] = useState(null);
    return (
        <div className="App">
            <Title />
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
    const imgRes = await projectFirestore
        .collection("images")
        .where("tags", "array-contains", context.query.tag)
        .get();

    const images = imgRes.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        .map((img) => {
            return {
                id: img.id,
                caption: img.caption,
                url: img.url,
                exif: img.exif,
                tags: img.tags,
                userData: img.userData,
            };
        });

    return {
        props: {
            images,
        },
    };
}
