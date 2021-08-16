import { useState, useEffect, useContext } from "react";
import Title from "../components/Title";
import ImageGrid from "../components/ImageGrid";
import Modal from "../components/Modal";

import { auth, projectFirestore } from "../firebase/config";
import { UserContext } from "../providers/UserContext";
import { useRouter } from "next/router";
import styled from "styled-components";
import Layout from "../components/Layout";
import Footer from "../components/Footer";

const Container = styled.div``;
export default function Home({ images }) {
    const [selectedImg, setSelectedImg] = useState(null);
    const router = useRouter();
    const { userData, setUserData } = useContext(UserContext);
    const [bgColor, setBGColor] = useState();
    const [nightMode, setNightMode] = useState();

    // console.log(localStorage.getItem("nightMode"));

    useEffect(() => {
        if (nightMode == "true") {
            console.log("jaksjdl");
            setBGColor("#253335");
        }
        if (nightMode == "false") {
            console.log("kskskssk");
            setBGColor("#fff");
        }
    }, [nightMode, setNightMode]);

    useEffect(() => {
        // console.log(localStorage.getItem("nightMode"));
        setNightMode(localStorage.getItem("nightMode"));
    }, []);

    if (userData?.user?.uid && userData?.user?.username == null) {
        router.push("/profile");
    }

    // function shuffleImages(arr) {
    //     for (let i = arr.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [arr[i], arr[j]] = [arr[j], arr[i]];
    //     }
    // }
    // shuffleImages(images);
    // images.slice(0, 11);

    return (
        <Layout>
            <Container className="App">
                <Title bgColor={bgColor} setNightMode={setNightMode} />
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
            <Footer />
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
