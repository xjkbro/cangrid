import { useState, useEffect, useContext } from "react";
import Title from "../../components/Title";
import UploadForm from "../../components/UploadForm";
import ImageGrid from "../../components/ImageGrid";
import UniversalGrid from "../../components/UniversalGrid";
import Modal from "../../components/Modal";

import { auth, projectFirestore } from "../../firebase/config";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import { useRouter } from "next/router";
import { UserContext } from "../../providers/UserContext";

function SingleUser({ userInfo, images }) {
    console.log(images);
    const [selectedImg, setSelectedImg] = useState(null);
    const [user, loading] = useAuthState(auth);
    const { userData, setUserData } = useContext(UserContext);

    console.log(userInfo);
    console.log(user);
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
    return (
        <div className="App">
            <Title
                userInfo={userInfo}
                bgColor={bgColor}
                setNightMode={setNightMode}
            />
            {/* {userInfo?.id == user?.uid ? <UploadForm /> : <></>} */}
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
    );
}
export async function getServerSideProps(context) {
    let collectionRef = projectFirestore.collection("users");
    let userRef = null;
    var query = await collectionRef
        .where("username", "==", context.query.username)
        .limit(1)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                userRef = doc.ref;
                // console.log(doc.id, " => ", doc.data());
            });
        });
    // console.log(query);
    if (userRef == undefined)
        return {
            redirect: {
                permanent: false,
                destination: "/users/404",
            },
            props: {},
        };

    // let arr = [];
    // var imagesMap = await projectFirestore
    //     .collection("images")
    //     .get()
    //     .then((querySnapshot) => {
    //         querySnapshot.forEach((img) => {
    //             const imgData = img.data();
    //             console.log(imgData);
    //             arr.push({
    //                 id: img.id,
    //                 caption: imgData.caption,
    //                 url: imgData.url,
    //                 exif: imgData.exif,
    //                 tags: imgData.tags,
    //             });
    //         });
    //     });
    // console.log(arr);

    // let arr = [];
    // var images = await userRef
    //     .collection("images")
    //     .get()
    //     .then((querySnapshot) => {
    //         querySnapshot.forEach(async (img) => {
    //             const { imageRef } = img.data();
    //             const { exif, url, userData, createdAt, tags, caption } =
    //                 await imageRef.get().then((img) => {
    //                     const imgData = img.data();
    //                     return imgData;
    //                 });

    //             let data = await {
    //                 id: img.id,
    //                 exif,
    //                 url,
    //                 tags,
    //                 userData,
    //                 createdAt,
    //                 tags,
    //                 caption,
    //             };
    //             // console.log(data);
    //             arr.push(async () => {
    //                 return await {
    //                     id: img.id,
    //                     exif,
    //                     url,
    //                     tags,
    //                     userData,
    //                     createdAt,
    //                     tags,
    //                     caption,
    //                 };
    //             });
    //         });
    //     });

    // const imgRes = await userRef.collection("images").get();

    // array of docs for /users/images
    // const imgCollection = imgRes.docs.map((doc) => {
    //     console.log("imgcollection", doc);
    //     return {
    //         id: doc.id,
    //         ...doc.data(),
    //     };
    // });
    // console.log(imgRes);
    // console.log(imgCollection);

    // const images = await imgCollection.map(async (doc) => {
    //     const imgs = await doc.imageRef.get().then(async (img) => {
    //         const imgData = img.data();
    //         // console.log("you", imgData);
    //         return await imgData;
    //     });
    //     // console.log("asdasd", imgs);
    //     return {
    //         id: doc.id,
    //         ...imgs,
    //     };
    // });

    // console.log(images);
    // const images = imgRes.docs
    //     .map((doc) => {
    //         return {
    //             id: doc.id,
    //             ...doc.data(),
    //         };
    //     })
    //     .map((img) => {
    //         // console.log(img);
    //         return {
    //             id: img.id,
    //             caption: img.caption,
    //             url: img.url,
    //             exif: img.exif,
    //             tags: img.tags,
    //             userData: img.userData,
    //         };
    //     });

    const imgRes = await userRef.collection("images").get();

    // array of docs for /users/images
    const imgCollection = imgRes.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data(),
        };
    });
    // console.log(imgRes);
    // console.log(imgCollection);

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
                console.log(createdAt.toDate());
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
    // Promise.all(images).then(function (results) {
    //     console.log(results);
    // });

    const userRes = await userRef.get().then((item) => {
        return { id: item.id, ...item.data() };
    });
    // console.log("user:", userRes);
    // console.log("images:", images);

    return {
        props: {
            userInfo: userRes,
            images: await Promise.all(images),
            // images,
            // images: arr,
        },
    };
}
export default SingleUser;
