import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useState, useEffect, useContext } from "react";
import Title from "../components/Title";
import UploadForm from "../components/UploadForm";
import ImageGrid from "../components/ImageGrid";
import UniversalGrid from "../components/UniversalGrid";
import Modal from "../components/Modal";

import { auth, projectFirestore } from "../firebase/config";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import { UserContext } from "../providers/UserContext";

export default function Home({ images }) {
    const [selectedImg, setSelectedImg] = useState(null);
    // const [user, loading] = useAuthState(auth);
    const { userData, setUserData } = useContext(UserContext);
    console.log(userData);
    return (
        <div className="App">
            <Title />
            {/* <UploadForm /> */}
            <UniversalGrid images={images} setSelectedImg={setSelectedImg} />
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
    let imgRes = await projectFirestore
        .collection("images")
        .orderBy("createdAt", "desc")
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
