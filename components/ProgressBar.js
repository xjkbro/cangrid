import { useEffect } from "react";
import useStorage from "../hooks/useStorage";
import { motion } from "framer-motion";

const ProgressBar = ({
    file,
    setFile,
    caption,
    setCaption,
    exifInfo,
    setExifInfo,
    setForm,
    tags,
    setTags,
}) => {
    const { progress, url } = useStorage(file, tags, caption, exifInfo);
    // console.log(progress);

    useEffect(() => {
        if (url) {
            setFile(null);
            setCaption("");
            setForm(null);
            setExifInfo(null);
            setTags([]);
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
