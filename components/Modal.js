import { motion } from "framer-motion";
import Link from "next/link";
import { ImageMetaData } from "./ImageMetaData";
import TextField from "@material-ui/core/TextField";
import { Tags } from "./Tags";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { addImgComment, imgLike } from "../firebase/config";
import { UserContext } from "../providers/UserContext";
import { useRouter } from "next/router";

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
const CommentForm = styled.form``;
const Comments = styled.ul`
    min-height: 40%;
`;
const Modal = ({ setSelectedImg, selectedImg }) => {
    const { userData, setUserData } = useContext(UserContext);
    const [comment, setComment] = useState();
    const router = useRouter();
    const refreshData = () => {
        router.replace(router.asPath);
    };
    useEffect(() => {
        refreshData();
    }, []);

    const handleClick = (e) => {
        if (e.target.id == "backdrop") {
            setSelectedImg(null);
        }
    };
    const handleLike = (e) => {
        if (e.target.id == "like") {
            imgLike(selectedImg);
        }
    };
    const handleSubmit = (e) => {
        addImgComment(userData.user, selectedImg, comment);
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
                    <Comments>
                        {selectedImg.comments.map((item, i) => {
                            return (
                                <li key={i}>
                                    <Link href={`/users/${item.user.username}`}>
                                        {item.user.username}
                                    </Link>
                                    : {item.comment}
                                </li>
                            );
                        })}
                    </Comments>
                    {/* <CommentForm onSubmit={handleSubmit}> */}
                    <div>
                        <span>Total Likes: {selectedImg.likes}</span>
                        <button id="like" onClick={handleLike}>
                            Like
                        </button>
                    </div>
                    <TextField
                        id="outlined-multiline-static"
                        multiline
                        rows={2}
                        label="Comment"
                        variant="outlined"
                        value={comment}
                        style={{ width: "100%" }}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                                setComment("");
                            }
                        }}
                    />
                    {/* </CommentForm> */}
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
