import { motion } from "framer-motion";
import Link from "next/link";
import { ImageMetaData } from "./ImageMetaData";
import { Tags } from "./Tags";
import styled from "styled-components";

const ProfilePic = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;
const ProfileName = styled.span`
    color: ${(props) => props.theme.colors.secondary};
    margin-left: 15px;
`;
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
    > div {
        display: flex;
        max-width: 90%;
        max-height: 90%;
        vertical-align: middle;
        box-shadow: 3px 5px 7px rgba(0, 0, 0, 0.5);
        background-color: white;
        border-radius: 10px;
    }
    > div > img {
        max-width: 50vw;
        max-height: 70vh;
        width: auto;
        height: auto;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    > div > div {
        min-width: 20vw;
        width: auto;
        height: auto;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        /* padding: 30px; */
    }
`;
const ModalUpload = styled.div`
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    /* width: 100%; */
    padding: 10px;
`;
const Description = styled.div`
    width: 100%;
    max-width: 500px;
    min-width: 400px;
`;
const Caption = styled.div`
    padding: 15px;
    width: 90%;
`;
const TagsContainer = styled.div`
    padding: 10px;
    width: 90%;
`;
const MetaTagContainer = styled.div`
    position: absolute;
    bottom: 10px;
    padding-left: 10px;
    color: ${(props) => props.theme.colors.primary};
`;
const Modal = ({ setSelectedImg, selectedImg }) => {
    const handleClick = (e) => {
        if (e.target.id == "backdrop") {
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
        <BackDrop
            id="backdrop"
            as={motion.div}
            onClick={handleClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div initial={{ x: "100vw" }} animate={{ x: 0 }}>
                <motion.img src={selectedImg.url} alt="enlarged pic" />
                <Description
                    style={{
                        width: "100%",
                    }}
                >
                    <ModalUpload>
                        <a
                            href={`/users/${selectedImg?.userData?.username}`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                textDecoration: "none",
                            }}
                        >
                            <ProfilePic
                                src={selectedImg?.userData?.photoURL}
                                alt=""
                            />{" "}
                            <ProfileName>
                                {selectedImg?.userData?.username}
                            </ProfileName>
                        </a>
                    </ModalUpload>
                    <Caption>
                        {/* <motion.p> */}
                        {selectedImg?.caption !== "" ? (
                            selectedImg?.caption
                        ) : (
                            <p>
                                <i>No Caption</i>
                            </p>
                        )}
                        {/* </motion.p> */}
                    </Caption>
                    {/* <ImgMetaData /> */}
                    <TagsContainer>
                        <Tags
                            tags={selectedImg?.tags}
                            setSelectedImg={setSelectedImg}
                        />
                    </TagsContainer>
                    <MetaTagContainer>
                        <ImageMetaData
                            exifInfo={selectedImg.exif}
                            modal={true}
                        />
                    </MetaTagContainer>
                </Description>
            </motion.div>
        </BackDrop>
    );
};

export default Modal;
