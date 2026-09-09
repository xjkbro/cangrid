import { useState, useEffect, useContext } from "react";
import Title from "../components/Title";
import ImageGrid from "../components/ImageGrid";
import Modal from "../components/Modal";
import { prisma } from "../lib/prisma";
import { imageInclude, transformImage } from "../lib/transformImage";
import { UserContext } from "../providers/UserContext";
import { useRouter } from "next/router";
import styled from "styled-components";
import Layout from "../components/Layout";
import Footer from "../components/Footer";

const Container = styled.div``;

export default function Home({ images, bgColor, nightMode, setNightMode }) {
    const [selectedImg, setSelectedImg] = useState(null);
    const router = useRouter();
    const { userData, setUserData } = useContext(UserContext);
    if (userData?.user?.uid && userData?.user?.username == null) {
        // When user is new, push user to profile route.
        router.push("/profile");
    }
    images = images.slice(0, 16);
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
            <Footer nightMode={nightMode} />
        </Layout>
    );
}
export async function getServerSideProps(context) {
    // Replaces the Firestore `orderBy("likeCount", "desc")` query — like
    // counts are no longer a manually-synced field, they're derived from
    // the `Like` join table via a relation-count order (#5).
    const imgRes = await prisma.image.findMany({
        include: imageInclude,
        orderBy: { likes: { _count: "desc" } },
        take: 16,
    });
    const images = imgRes.map(transformImage);
    // const shuffle = (array) => {
    //     var currentIndex = array.length,
    //         randomIndex;

    //     // While there remain elements to shuffle...
    //     while (currentIndex != 0) {
    //         // Pick a remaining element...
    //         randomIndex = Math.floor(Math.random() * currentIndex);
    //         currentIndex--;

    //         // And swap it with the current element.
    //         [array[currentIndex], array[randomIndex]] = [
    //             array[randomIndex],
    //             array[currentIndex],
    //         ];
    //     }

    //     return array;
    // };

    // const rando = shuffle(images);

    return {
        props: {
            images,
        },
    };
}
