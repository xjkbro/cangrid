import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useState, useEffect, useContext } from "react";
import Title from "../components/Title";
import UploadForm from "../components/UploadForm";
import ImageGrid from "../components/ImageGrid";
// import UniversalGrid from "../components/UniversalGrid";
import Modal from "../components/Modal";

import { auth, projectFirestore } from "../firebase/config";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import { UserContext } from "../providers/UserContext";
import { useRouter } from "next/router";
// import getHomeQuery from "../lib/firestoreQuery";

export default function Home({ images }) {
    const [selectedImg, setSelectedImg] = useState(null);
    // const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const { userData, setUserData } = useContext(UserContext);
    console.log(userData);

    // const imagess = getHomeQuery("images");
    // console.log(imagess);

    if (userData?.user?.uid && userData?.user?.username == null) {
        router.push("/profile");
    }
    return (
        <div className="App">
            <Title />
            {/* <UploadForm /> */}
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
                createdAt: img.createdAt.toDate().toString(),
                comments: img.comments,
                likes: img.likes,
            };
        });

    return {
        props: {
            images,
        },
    };
}
