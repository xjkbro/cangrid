import useFirestore from "../hooks/useFirestore";
import { motion } from "framer-motion";
import { auth, projectFirestore } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const ImageGrid = ({ setSelectedImg }) => {
    const [user] = useAuthState(auth);
    const [docs, setDocs] = useState([]);
    const router = useRouter();
    console.log(router.query);
    useEffect(() => {
        const unsub = projectFirestore
            .collection("users")
            .doc(router.query.id)
            .collection("images")
            .orderBy("createdAt", "desc")
            .onSnapshot((snap) => {
                let documents = [];
                snap.forEach((doc) => {
                    console.log(doc.id);
                    documents.push({ ...doc.data(), id: doc.id });
                });
                setDocs(documents);
            });

        return () => unsub();
        // this is a cleanup function that react will run when
        // a component using the hook unmounts
    }, [user]);

    console.log(docs);
    return (
        <div className="img-grid">
            {docs &&
                docs.map((doc) => {
                    // if (doc.user == user?.email) {
                    return (
                        <motion.div
                            className="img-wrap"
                            key={doc.id}
                            layout
                            whileHover={{ opacity: 1 }}
                            s
                            onClick={() => setSelectedImg(doc)}
                        >
                            <motion.img
                                src={doc.url}
                                alt="uploaded pic"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            />
                        </motion.div>
                    );
                    // }
                })}
        </div>
    );
};

export default ImageGrid;
