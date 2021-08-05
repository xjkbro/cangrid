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
import styled from "styled-components";
import Layout from "../components/Layout";

// import getHomeQuery from "../lib/firestoreQuery";

const Container = styled.div``;
export default function Home({ images }) {
    const [selectedImg, setSelectedImg] = useState(null);
    // const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const { userData, setUserData } = useContext(UserContext);
    console.log(userData);
    console.log(images);

    const [bgColor, setBGColor] = useState("#fff");
    const [nightMode, setNightMode] = useState(userData?.user?.nightMode);
    console.log(nightMode);
    useEffect(() => {
        if (nightMode == true) setBGColor("#253335");
        else setBGColor("#fff");
    }, [nightMode]);
    useEffect(() => {
        setNightMode(userData?.user?.nightMode);
    }, [userData]);

    // const imagess = getHomeQuery("images");
    // console.log(imagess);

    if (userData?.user?.uid && userData?.user?.username == null) {
        router.push("/profile");
    }
    return (
        <Layout>
            <Container className="App">
                <Title bgColor={bgColor} setNightMode={setNightMode} />
                {/* <UploadForm /> */}
                <ImageGrid images={images} setSelectedImg={setSelectedImg} />
                {selectedImg && (
                    <Modal
                        selectedImg={selectedImg}
                        setSelectedImg={setSelectedImg}
                    />
                )}
                <style jsx global>
                    {`
            html {
                background-color: ${bgColor};
        `}
                </style>
            </Container>
        </Layout>
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
