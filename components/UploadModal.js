import { motion } from "framer-motion";
import styled from "styled-components";
import UploadForm from "./UploadForm";
const BackDrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 600px) {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
const UploadModal = ({ setSelectUpload }) => {
    const handleClick = (e) => {
        if (e.target.classList.contains("backdrop")) {
            setSelectUpload(false);
        }
    };
    return (
        <BackDrop
            className="backdrop"
            style={{ zIndex: "2" }}
            onClick={handleClick}
        >
            <motion.div initial={{ x: "100vw" }} animate={{ x: 0 }}>
                <motion.div>
                    <UploadForm setSelectUpload={setSelectUpload} />
                </motion.div>
            </motion.div>
        </BackDrop>
    );
};
export default UploadModal;
