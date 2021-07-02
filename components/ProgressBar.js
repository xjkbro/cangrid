import { useEffect } from "react";
import useStorage from "../hooks/useStorage";
import { motion } from "framer-motion";

const ProgressBar = ({ file, setFile, caption, setCaption, setForm }) => {
    const { progress, url } = useStorage(file, caption);
    // console.log(progress);

    useEffect(() => {
        if (url) {
            setFile(null);
            setCaption("");
            setForm(null);
        }
    }, [url, setFile]);

    return (
        <motion.div
            className="progress-bar"
            initial={{ width: 0 }}
            animate={{ width: progress + "%" }}
        ></motion.div>
    );
};

export default ProgressBar;
