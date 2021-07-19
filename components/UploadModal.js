import { motion } from "framer-motion";
import UploadForm from "./UploadForm";
const UploadModal = ({ setSelectUpload }) => {
    const handleClick = (e) => {
        if (e.target.classList.contains("backdrop")) {
            setSelectUpload(false);
        }
    };
    return (
        <motion.div
            className="backdrop"
            style={{ zIndex: "2" }}
            onClick={handleClick}
        >
            <motion.div initial={{ x: "100vw" }} animate={{ x: 0 }}>
                <motion.div
                    style={{
                        width: "100%",
                    }}
                >
                    <UploadForm />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
export default UploadModal;
