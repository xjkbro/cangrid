import { useState, useEffect, useContext } from "react";
import Title from "../../components/Title";
import ImageGrid from "../../components/ImageGrid";
import Modal from "../../components/Modal";
import { prisma } from "../../lib/prisma";
import { imageInclude, transformImage } from "../../lib/transformImage";
import { UserContext } from "../../providers/UserContext";
import Layout from "../../components/Layout";
import Footer from "../../components/Footer";

export default function SingleUser({
    images,
    bgColor,
    nightMode,
    setNightMode,
}) {
    const [selectedImg, setSelectedImg] = useState(null);
    return (
        <Layout>
            <div className="App">
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
            </div>
            <Footer nightMode={nightMode} />
        </Layout>
    );
}
export async function getServerSideProps(context) {
    // Replaces the Firestore `array-contains` query against a `Tag`/`Image`
    // relation lookup (#5) — indexed, instead of scanning a string array.
    const imgRes = await prisma.image.findMany({
        where: { tags: { some: { name: context.query.tag } } },
        include: imageInclude,
        orderBy: { createdAt: "desc" },
    });

    const images = imgRes.map(transformImage);

    return {
        props: {
            images,
        },
    };
}
