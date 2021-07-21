import { motion } from "framer-motion";
import Link from "next/link";
import { ImageMetaData } from "./ImageMetaData";
import { Tags } from "./Tags";

const Modal = ({ setSelectedImg, selectedImg }) => {
    const handleClick = (e) => {
        if (e.target.classList.contains("backdrop")) {
            setSelectedImg(null);
        }
    };

    const ImgMetaData = () => {
        const { exif } = selectedImg;

        // if (JSON.stringify(exif) != "{}") {
        if (exif) {
            return (
                <motion.div
                    style={{
                        margin: "5px",
                        width: "100%",
                    }}
                >
                    <motion.p>
                        {exif?.model ? exif?.model : "Unidentiied Camera"}{" "}
                        running{" "}
                        {exif?.cameraFunction
                            ? exif?.cameraFunction
                            : "Unidentified Function"}{" "}
                        where Exposure was
                        {exif?.exposure?.numerator
                            ? exif?.exposure?.numerator
                            : "1"}
                        /
                        {exif?.exposure?.denominator
                            ? exif?.exposure?.denominator
                            : "∞"}
                        s, focal length was{" "}
                        {exif?.focalLength?.value
                            ? exif?.focalLength?.value
                            : "Unidentified"}{" "}
                        and aperature was{" f"}
                        {exif?.aperature?.value
                            ? exif?.aperature?.value
                            : "Unidentified"}
                    </motion.p>
                </motion.div>
            );
        } else {
            return <></>;
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
                    <motion.div className="modalUpload">
                        <a
                            href={`/users/${selectedImg?.userData?.username}`}
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
                                src={selectedImg?.userData?.photoURL}
                                alt=""
                            />{" "}
                            <span
                                style={{
                                    margin: "15px",
                                    color: "black",
                                }}
                            >
                                {selectedImg?.userData?.username}
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
                            {selectedImg?.caption !== "" ? (
                                selectedImg?.caption
                            ) : (
                                <p>
                                    <i>No Caption</i>
                                </p>
                            )}
                        </motion.p>
                    </motion.div>
                    {/* <ImgMetaData /> */}
                    <Tags
                        tags={selectedImg?.tags}
                        setSelectedImg={setSelectedImg}
                    />
                    <ImageMetaData exifInfo={selectedImg.exif} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Modal;
