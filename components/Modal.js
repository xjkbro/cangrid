import { motion } from "framer-motion";
import Link from "next/link";
import { ImageMetaData } from "./ImageMetaData";
import TextField from "@material-ui/core/TextField";
import { Tags } from "./Tags";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserContext";
import { useRouter } from "next/router";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

const ProfilePic = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
`;
const ProfileName = styled.span`
    font-family: "Nunito", sans-serif;
    font-weight: 700;
    color: var(--text);
    margin-left: 12px;
`;

// Only the tab panel (Details/Comments) scrolls. The image, the
// username/likes header, and the tab bar stay fixed in place.
const BackDrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(20, 30, 29, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    > div {
        display: flex;
        flex-direction: column;
        max-width: 90%;
        min-width: 85%;
        max-height: 90vh;
        vertical-align: middle;
        box-shadow: 0 20px 60px rgba(20, 30, 29, 0.35);
        background-color: var(--surface);
        border-radius: 14px;
        overflow: hidden;
    }
    > div > img {
        flex: none;
        max-width: 100%;
        max-height: 45vh;
        width: auto;
        height: auto;
        object-fit: contain;
        margin: 0 auto;
        background: var(--bg);
    }

    @media (min-width: 768px) {
        > div {
            max-width: 70%;
            min-width: 60%;
        }
    }

    @media (min-width: 1280px) {
        > div {
            flex-direction: row;
            min-width: 50%;
            max-width: 80%;
        }
        > div > img {
            max-height: 90vh;
            max-width: 55vw;
        }
    }
`;
// Username + likes. Never scrolls.
const ModalUpload = styled.div`
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    padding: 14px 16px;
`;
const Description = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    width: 100%;

    @media (min-width: 1280px) {
        width: 500px;
        max-width: 500px;
    }
`;
// Tab bar. Never scrolls.
const TabBar = styled.div`
    flex: none;
    display: flex;
    border-bottom: 1px solid var(--border);
`;
const TabButton = styled.button`
    flex: 1;
    padding: 12px 16px;
    background: none;
    border: none;
    border-bottom: 2px solid
        ${(props) => (props.$active ? "var(--accent-strong)" : "transparent")};
    font-family: "Nunito", sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    color: ${(props) => (props.$active ? "var(--accent-strong)" : "var(--text-muted)")};
    cursor: pointer;
`;
// The one thing that scrolls.
const TabPanel = styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
`;
const Caption = styled.div`
    padding: 16px;
    font-family: "Nunito", sans-serif;
    color: var(--text);

    i {
        color: var(--text-muted);
        font-style: normal;
    }
`;
const TagsContainer = styled.div`
    padding: 4px 16px 16px;
`;
const MetaTagContainer = styled.div`
    padding: 0 16px;
    color: var(--accent-strong);
`;
const CommentPic = styled.img`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
`;
const CommentForm = styled(TextField)`
    margin: 14px 16px;
    width: calc(100% - 32px);
    font-family: "Nunito", sans-serif;

    .MuiInputLabel-root {
        font-family: "Nunito", sans-serif;
        color: var(--text-muted);
    }
    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: var(--accent-strong);
    }
    .MuiInputBase-input {
        font-family: "Nunito", sans-serif;
        color: var(--text);
    }
`;
const CommentList = styled.div`
    padding: 0 16px 16px;
    font-family: "Nunito", sans-serif;
    font-size: 0.875rem;
`;
const NoComments = styled.p`
    padding: 0 16px 16px;
    font-family: "Nunito", sans-serif;
    font-size: 0.875rem;
    color: var(--text-muted);
`;
const SingleComment = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    color: var(--text);
    a,
    img {
        cursor: pointer;
    }
    a {
        color: var(--text);
        font-weight: 700;
        text-decoration: none;
    }
    span {
        overflow-wrap: break-word;
    }
`;
const Likes = styled.div`
    flex: none;
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: "Nunito", sans-serif;
    color: var(--text-muted);
    svg {
        cursor: pointer;
    }
`;

const Modal = ({ setSelectedImg, selectedImg }) => {
    const { userData, setUserData } = useContext(UserContext);
    const [comment, setComment] = useState("");
    const [activeTab, setActiveTab] = useState("details");
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
        const res = await fetch(`/api/images/${selectedImg.id}/like`, {
            method: likeIcon ? "DELETE" : "POST",
        });
        if (res.ok) {
            const { likeCount } = await res.json();
            setTempLikes(likeCount);
            setLikeIcon(!likeIcon);
        }
    };
    const handleSubmit = async (e) => {
        if (userData.user && comment && comment.trim()) {
            const res = await fetch(`/api/images/${selectedImg.id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment }),
            });
            if (res.ok) {
                const { comments } = await res.json();
                setTempCommentsArr(comments);
            }
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
                {/* Plain <img>, not next/image: the modal shows photos at whatever
                    aspect ratio they actually are, and a fixed width/height box
                    (next/image's requirement) would letterbox anything that isn't
                    square. */}
                <img src={selectedImg.url} alt="enlarged pic" />
                <Description>
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
                            />
                            <ProfileName>
                                {selectedImg?.userData?.username}
                            </ProfileName>
                        </a>
                        <Likes>
                            <span>{tempLikes}</span>
                            {likeIcon ? (
                                <FavoriteIcon
                                    id="like"
                                    onClick={handleLike}
                                    style={{ color: "#e0575c" }}
                                />
                            ) : (
                                <FavoriteBorderIcon
                                    id="like"
                                    onClick={handleLike}
                                />
                            )}
                        </Likes>
                    </ModalUpload>
                    <TabBar>
                        <TabButton
                            type="button"
                            $active={activeTab === "details"}
                            onClick={() => setActiveTab("details")}
                        >
                            Details
                        </TabButton>
                        <TabButton
                            type="button"
                            $active={activeTab === "comments"}
                            onClick={() => setActiveTab("comments")}
                        >
                            Comments ({tempCommentsArr.length})
                        </TabButton>
                    </TabBar>
                    {activeTab === "details" ? (
                        <TabPanel>
                            <Caption>
                                {selectedImg?.caption !== "" ? (
                                    selectedImg?.caption
                                ) : (
                                    <i>No caption</i>
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
                        </TabPanel>
                    ) : (
                        <TabPanel>
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
                            {tempCommentsArr.length === 0 ? (
                                <NoComments>No comments yet.</NoComments>
                            ) : (
                                <CommentList>
                                    {tempCommentsArr.map((item, i) => (
                                        <SingleComment key={i}>
                                            <Link
                                                href={`/users/${item.user.username}`}
                                            >
                                                <CommentPic
                                                    src={item.user.photoURL}
                                                />
                                            </Link>
                                            <span>
                                                <Link
                                                    href={`/users/${item.user.username}`}
                                                >
                                                    {item.user.username}
                                                </Link>{" "}
                                                {item.comment}
                                            </span>
                                        </SingleComment>
                                    ))}
                                </CommentList>
                            )}
                        </TabPanel>
                    )}
                </Description>
            </motion.div>
        </BackDrop>
    );
};

export default Modal;
