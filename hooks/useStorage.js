import { useState, useEffect, useContext } from "react";
import {
    auth,
    projectStorage,
    projectFirestore,
    timestamp,
} from "../firebase/config";
import { UserContext } from "../providers/UserContext";
import { useAuthState } from "react-firebase-hooks/auth";

const useStorage = (file, tags, caption, exifInfo) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    const [user, loading] = useAuthState(auth);
    const { userData, setUserData } = useContext(UserContext);

    useEffect(() => {
        // References
        // Reference to file
        const storageRef = projectStorage.ref(file.name);
        console.log(storageRef);
        const collectionRef = projectFirestore.collection("images");
        const userImageCollectionRef = projectFirestore
            .doc(`users/${user.uid}`)
            .collection("images");
        const userRef = projectFirestore.doc(`users/${user.uid}`);
        storageRef.put(file).on(
            "state_changed",
            (snap) => {
                let percent = (snap.bytesTransferred / snap.totalBytes) * 100;
                setProgress(percent);
            },
            (err) => {
                setError(err);
            },
            async () => {
                const url = await storageRef.getDownloadURL();
                console.log(storageRef.storage);
                const createdAt = timestamp();
                let insert = {
                    url,
                    createdAt,
                    caption,
                    tags,
                    exif: exifInfo,
                    userData: userData.user,
                };
                // let insert = {
                //     url,
                //     createdAt,
                //     caption,
                //     tags,
                //     exif: exifInfo,
                //     user: userRef,
                // };
                console.log(insert);
                const imgRef = await collectionRef.add(insert);
                userImageCollectionRef.add({ imageRef: imgRef });

                // userImageCollectionRef.add(insert);
                setUrl(url);
            }
        );
    }, [file]);
    return { progress, error, url };
};
export default useStorage;
