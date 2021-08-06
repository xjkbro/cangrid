import { useEffect } from "react";
import useStorage from "../hooks/useStorage";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

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
    setSelectUpload,
}) => {
    const { progress, url } = useStorage(file, tags, caption, exifInfo);
    const router = useRouter();
    const refreshData = () => {
        router.replace(router.asPath);
    };
    useEffect(() => {
        if (url) {
            setFile(null);
            setCaption("");
            setForm(null);
            setExifInfo(null);
            setTags([]);
            setSelectUpload(false);
        }
        refreshData();
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
