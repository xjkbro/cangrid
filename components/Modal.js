import { motion } from "framer-motion";
import Link from "next/link";

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
                <motion.div
                    style={{
                        width: "100%",
                    }}
                >
                    <motion.div
                        style={{
                            borderBottom: "1px solid gray",
                            // paddingBottom: "15px",
                            width: "100%",
                        }}
                    >
                        <a
                            href={`/users/${selectedImg.userData.uid}`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                textDecoration: "none",
                            }}
                        >
                            <img
                                style={{
                                    height: "25px",
                                    width: "25px",
                                    borderRadius: "50%",
                                }}
                                src={selectedImg.userData.photoURL}
                                alt=""
                            />{" "}
                            <span
                                style={{
                                    margin: "15px",
                                    color: "black",
                                }}
                            >
                                {selectedImg.userData.username}
                            </span>
                        </a>
                    </motion.div>
                    <motion.div
                        style={{
                            margin: "5px",
                            width: "100%",
                        }}
                    >
                        {" "}
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
        </motion.div>
    );
};

export default Modal;
