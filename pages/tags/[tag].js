import { useState, useEffect, useContext } from "react";
import Title from "../../components/Title";
import ImageGrid from "../../components/ImageGrid";
import Modal from "../../components/Modal";

import { auth, projectFirestore } from "../../firebase/config";
import { UserContext } from "../../providers/UserContext";
import Layout from "../../components/Layout";

export default function SingleUser({ images }) {
    const [selectedImg, setSelectedImg] = useState(null);
    const { userData, setUserData } = useContext(UserContext);

    const [bgColor, setBGColor] = useState("#fff");
    const [nightMode, setNightMode] = useState(userData?.user?.nightMode);
    useEffect(() => {
        if (nightMode == true) setBGColor("#253335");
        else setBGColor("#fff");
    }, [nightMode]);
    useEffect(() => {
        setNightMode(userData?.user?.nightMode);
    }, [userData]);
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
        </Layout>
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
