import { useState, useEffect, useContext } from "react";
import Title from "../../components/Title";
import ImageGrid from "../../components/ImageGrid";
import Modal from "../../components/Modal";
import { prisma } from "../../lib/prisma";
import { imageInclude, transformImage } from "../../lib/transformImage";
import { UserContext } from "../../providers/UserContext";
import Layout from "../../components/Layout";
import Footer from "../../components/Footer";

function SingleUser({ userInfo, images, bgColor, nightMode, setNightMode }) {
    const [selectedImg, setSelectedImg] = useState(null);
    return (
        <Layout>
            <div className="App">
                <Title
                    userInfo={userInfo}
                    bgColor={bgColor}
                    setNightMode={setNightMode}
                />
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
    // Replaces the Firestore "resolve user doc -> images subcollection ->
    // dereference each imageRef" chain with a single relation query (#5) —
    // no more reference-dereferencing.
    const user = await prisma.user.findUnique({
        where: { username: context.query.username },
        include: {
            images: {
                include: imageInclude,
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!user) {
        return {
            redirect: {
                permanent: false,
                destination: "/users/404",
            },
            props: {},
        };
    }

    const { images: userImages, password, ...userFields } = user;

    return {
        props: {
            userInfo: {
                id: userFields.id,
                username: userFields.username,
                displayName: userFields.displayName,
                description: userFields.description,
                photoURL: userFields.image,
                nightMode: userFields.nightMode,
            },
            images: userImages.map(transformImage),
        },
    };
}
export default SingleUser;
