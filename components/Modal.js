import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ImageMetaData } from "./ImageMetaData";
import TextField from "@material-ui/core/TextField";
import { Tags } from "./Tags";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { addImgComment, imgLike } from "../firebase/config";
import { UserContext } from "../providers/UserContext";
import { useRouter } from "next/router";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

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
    z-index: 2;
    > div {
        display: flex;
        max-width: 90%;
        min-width: 85%;
        // height: 80vh;
        vertical-align: middle;
        box-shadow: 3px 5px 7px rgba(0, 0, 0, 0.5);
        background-color: white;
        border-radius: 10px;
        flex-direction: column;
    }
    > div > img {
        max-width: 100%;
        width: auto;
        height: auto;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    > div > div {
        min-width: 20vw;
        height: 70%;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    @media (min-width: 768px) {
        > div {
            max-width: 70%;
            min-width: 60%;
        }
    }

    @media (min-width: 1280px) {
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
            min-width: 50%;
            vertical-align: middle;
            box-shadow: 3px 5px 7px rgba(0, 0, 0, 0.5);
            background-color: white;
            border-radius: 10px;
            flex-direction: row;
        }
        > div > img {
            display: block;
            max-width: 50vw;
            max-height: 50vh;
            width: auto;
            height: auto;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            border-top-right-radius: 0;
        }
        > div > div {
            min-width: 20vw;
            height: 70%;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
        }
    }
    @media (min-width: 1376px) {
    }
`;
const ModalUpload = styled.div`
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 10px;
`;
const Description = styled.div`
    position: relative;
    width: 100%;
    max-width: 100%;
    min-width: 400px;
    * {
        font-size: 14px;
    }
    @media (min-width: 1280px) {
        width: 100%;
        max-width: 500px;
        min-width: 400px;
        * {
            font-size: 18px;
        }
    }
`;
const Caption = styled.div`
    padding: 15px;
    width: 90%;
`;
const TagsContainer = styled.div`
    padding: 10px;
    width: 90%;
    * {
        font-size: 12px;
    }
    @media (min-width: 768px) {
        * {
            font-size: 18px;
        }
    }
`;
const MetaTagContainer = styled.div`
    padding-left: 10px;
    color: ${(props) => props.theme.colors.primary};
    * {
        font-size: 14px;
    }
    @media (min-width: 768px) {
        * {
            font-size: 18px;
        }
    }
`;
const InfoContainer = styled.div`
    overflow-y: scroll;
    height: 30vh;
    @media (min-width: 768px) {
    }
`;
const CommentPic = styled.img`
    width: 20px;
    height: 20px;
    border-radius: 50%;
`;
const CommentForm = styled(TextField)`
    margin: 10px auto;
    left: 10px;
    width: 95%;
`;
const Comments = styled.div`
    overflow-y: hidden;
    margin: 5px 10px;
    div {
        padding-top: 3px;
    }
`;
const SingleComment = styled.div`
    display: flex;
    a,
    img {
        cursor: pointer;
    }
    * {
        padding-right: 2px;
    }
    span {
        overflow-wrap: break-word;
    }
`;
const Likes = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
    display: flex;
    align-items: center;
    svg {
        cursor: pointer;
    }
    * {
        padding: 3px;
    }
    @media (min-width: 768px) {
        position: absolute;
        top: 15px;
        right: 15px;
        display: flex;
        align-items: center;
        svg {
            cursor: pointer;
        }
        * {
            padding: 3px;
        }
    }
`;

const Modal = ({ setSelectedImg, selectedImg }) => {
    const { userData, setUserData } = useContext(UserContext);
    const [comment, setComment] = useState();
    const [toggleComments, setToggleComments] = useState(true);
    let userLiked = selectedImg.likes.indexOf(userData?.user?.uid);
    const [likeIcon, setLikeIcon] = useState(userLiked == -1 ? false : true);
    let [tempLikes, setTempLikes] = useState(selectedImg.likes.length);
    let [tempCommentsArr, setTempCommentsArr] = useState(selectedImg.comments);
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
            refreshData();
        }
    };
    const handleLike = async (e) => {
        if (!likeIcon) {
            const newCount = await imgLike(userData.user, selectedImg, "add");
            setTempLikes(newCount);
        } else {
            const newCount = await imgLike(
                userData.user,
                selectedImg,
                "remove"
            );
            setTempLikes(newCount);
        }
        setLikeIcon(!likeIcon);
    };
    const handleSubmit = async (e) => {
        if (userData.user) {
            const newComments = await addImgComment(
                userData.user,
                selectedImg,
                comment
            );
            setTempCommentsArr(newComments);
        }
    };
    return (
        <BackDrop
            id="backdrop"
            as={motion.div}
            onClick={handleClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div initial={{ x: "100vw" }} animate={{ x: 0 }}>
                <Image
                    width={600}
                    height={600}
                    src={selectedImg.url}
                    objectFit="contain"
                    alt="enlarged pic"
                />
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
                        <Likes>
                            <span> {tempLikes}</span>
                            {likeIcon ? (
                                <FavoriteIcon id="like" onClick={handleLike} />
                            ) : (
                                <FavoriteBorderIcon
                                    id="like"
                                    onClick={handleLike}
                                />
                            )}
                        </Likes>
                    </ModalUpload>
                    <InfoContainer>
                        <Caption>
                            {selectedImg?.caption !== "" ? (
                                selectedImg?.caption
                            ) : (
                                <p>
                                    <i>No Caption</i>
                                </p>
                            )}
                        </Caption>
                        <MetaTagContainer>
                            <ImageMetaData
                                exifInfo={selectedImg.exif}
                                modal={true}
                            />
                        </MetaTagContainer>
                        <TagsContainer>
                            <Tags
                                tags={selectedImg?.tags}
                                setSelectedImg={setSelectedImg}
                            />
                        </TagsContainer>
                        <CommentForm
                            id="outlined-multiline-static"
                            multiline
                            rows={1}
                            label="Comment"
                            variant="outlined"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSubmit();
                                    setComment("");
                                }
                            }}
                        />
                        {toggleComments ? (
                            <Comments>
                                <a
                                    style={{ left: "10px", cursor: "pointer" }}
                                    onClick={() =>
                                        setToggleComments(!toggleComments)
                                    }
                                >
                                    Show All Comments ({tempCommentsArr.length})
                                </a>
                            </Comments>
                        ) : (
                            <Comments>
                                <a
                                    style={{ left: "10px", cursor: "pointer" }}
                                    onClick={() =>
                                        setToggleComments(!toggleComments)
                                    }
                                >
                                    Hide Comments
                                </a>
                                {tempCommentsArr.map((item, i) => {
                                    return (
                                        <SingleComment key={i}>
                                            <span>
                                                <Link
                                                    href={`/users/${item.user.username}`}
                                                >
                                                    <CommentPic
                                                        src={item.user.photoURL}
                                                    />
                                                </Link>
                                                <Link
                                                    href={`/users/${item.user.username}`}
                                                >
                                                    {item.user.username}
                                                </Link>
                                                : {item.comment}
                                            </span>
                                        </SingleComment>
                                    );
                                })}
                            </Comments>
                        )}
                    </InfoContainer>
                </Description>
            </motion.div>
        </BackDrop>
    );
};

export default Modal;
