import { useState, useEffect } from "react";
import {
    auth,
    projectStorage,
    projectFirestore,
    timestamp,
} from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

const useStorage = (file, caption) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        // references
        const storageRef = projectStorage.ref(file.name);
        const collectionRef = projectFirestore.collection("images");

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
                const createdAt = timestamp();
                collectionRef.add({
                    url,
                    createdAt,
                    caption,
                    user: user.email,
                });
                setUrl(url);
            }
        );
    }, [file]);
    return { progress, error, url };
};
export default useStorage;
