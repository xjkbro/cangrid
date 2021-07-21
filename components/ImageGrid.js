import useFirestore from "../hooks/useFirestore";
import { motion } from "framer-motion";
import { auth, projectFirestore } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { UserContext } from "../providers/UserContext";

import { FadeTransform, Stagger } from "react-animation-components";
import { TransitionGroup } from "react-transition-group";

const ImageGrid = ({ images, setSelectedImg }) => {
    const [user] = useAuthState(auth);
    const { userData, setUserData } = useContext(UserContext);
    const [docs, setDocs] = useState([]);
    const router = useRouter();
    console.log(router.query);
    console.log(userData);
    useEffect(async () => {
        let collectionRef = projectFirestore.collection("users");
        let userRef = null;
        var query = await collectionRef
            .where("username", "==", router.query.username)
            .limit(1)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    userRef = doc.ref;
                });
            });

        const imgRes = await userRef
            .collection("images")
            .orderBy("createdAt", "desc")
            .onSnapshot((snap) => {
                let documents = [];
                snap.forEach((doc) => {
                    // console.log(doc.id);
                    documents.push({ ...doc.data(), id: doc.id });
                });
                setDocs(documents);
            });
    }, [user]);

    console.log(docs);
    return (
        <TransitionGroup>
            <Stagger in className="img-grid">
                {images &&
                    images?.map((doc) => {
                        // if (doc.user == user?.email) {
                        return (
                            <FadeTransform
                                in
                                fadeProps={{
                                    enterOpacity: 1,
                                    exitOpacity: 0,
                                }}
                                transformProps={{
                                    exitTransform: "translateY(100px)",
                                }}
                            >
                                <div
                                    className="img-wrap"
                                    key={doc.id}
                                    onClick={() => setSelectedImg(doc)}
                                >
                                    <motion.img
                                        src={doc.url}
                                        alt="uploaded pic"
                                    />
                                </div>
                            </FadeTransform>
                        );
                    })}
            </Stagger>
        </TransitionGroup>
    );
};

export default ImageGrid;
