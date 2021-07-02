import { motion } from "framer-motion";

const Modal = ({ setSelectedImg, selectedImg }) => {
    const handleClick = (e) => {
        if (e.target.classList.contains("backdrop")) {
            setSelectedImg(null);
        }
    };

    console.log(selectedImg);
    return (
        <motion.div
            className="backdrop"
            onClick={handleClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div initial={{ x: "100vw" }} animate={{ x: 0 }}>
                <motion.img src={selectedImg.url} alt="enlarged pic" />
                <motion.div>
                    Caption:
                    <motion.p>
                        {selectedImg.caption !== "" ? (
                            selectedImg.caption
                        ) : (
                            <p>
                                <i>No Caption</i>
                            </p>
                        )}
                    </motion.p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Modal;
