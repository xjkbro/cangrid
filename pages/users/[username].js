import { useState, useEffect, useContext } from "react";
import Title from "../../components/Title";
import ImageGrid from "../../components/ImageGrid";
import Modal from "../../components/Modal";
import { projectFirestore } from "../../firebase/config";
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
    let collectionRef = projectFirestore.collection("users");
    let userRef = null;
    await collectionRef
        .where("username", "==", context.query.username)
        .limit(1)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                userRef = doc.ref;
            });
        });
    if (userRef == undefined)
        return {
            redirect: {
                permanent: false,
                destination: "/users/404",
            },
            props: {},
        };

    const imgRes = await userRef.collection("images").get();

    // array of docs for /users/images
    const imgCollection = imgRes.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data(),
        };
    });

    const images = imgCollection
        .map((doc) => {
            return doc.imageRef.get().then((img) => {
                const {
                    exif,
                    url,
                    userData,
                    createdAt,
                    tags,
                    caption,
                    comments,
                    likes,
                } = img.data();
                return {
                    id: img.id,
                    exif,
                    url,
                    tags,
                    userData,
                    caption,
                    createdAt: createdAt.toDate().toString(),
                    comments,
                    likes,
                };
            });
        })
        .reverse();
    const userRes = await userRef.get().then((item) => {
        return { id: item.id, ...item.data() };
    });

    return {
        props: {
            userInfo: userRes,
            images: await Promise.all(images),
        },
    };
}
export default SingleUser;
