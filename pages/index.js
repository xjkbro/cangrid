import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useState, useEffect } from "react";
import Title from "../components/Title";
import UploadForm from "../components/UploadForm";
import ImageGrid from "../components/ImageGrid";
import UniversalGrid from "../components/UniversalGrid";
import Modal from "../components/Modal";

import { auth, projectFirestore } from "../firebase/config";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";

export default function Home() {
    const [selectedImg, setSelectedImg] = useState(null);
    const [user, loading] = useAuthState(auth);
    return (
        <div className="App">
            <Title />
            <UploadForm />
            <UniversalGrid setSelectedImg={setSelectedImg} />
            {selectedImg && (
                <Modal
                    selectedImg={selectedImg}
                    setSelectedImg={setSelectedImg}
                />
            )}
        </div>
    );
}
