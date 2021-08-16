import Link from "next/link";
import Button from "@material-ui/core/Button";
import { useAuthState } from "react-firebase-hooks/auth";
import {
    auth,
    provider,
    projectFirestore,
    setNightModeSetting,
} from "../firebase/config";
import { UserContext } from "../providers/UserContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "../public/images/cangrid.png";
import UploadModal from "./UploadModal";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import MenuIcon from "@material-ui/icons/Menu";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import styled from "styled-components";

const Container = styled.div`
    h2,
    p {
        text-align: center;
    }
    h2 {
        margin: 0px;
        font-size: 1.6rem;
    }
`;
const TitleBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    height: 50px;
    a {
        width: 180px;
    }
    @media (min-width: 768px) {
        height: 89px;
        a {
            width: 300px;
        }
    }
`;
const Control = styled.div`
    display: flex;
    align-items: center;
    .menulist {
        z-index: 3;
        width: 150px;
        li {
            min-height: 36px;
            text-align: left;
            padding: 5px 10px;
        }
        .MuiPaper-root {
            color: inherit !important;
        }
    }
`;
const UploadButton = styled.label`
    display: inline-block;
    position: relative;
    width: 30px;
    height: 30px;
    border: 1px solid ${(props) => props.theme.colors.primary};
    border-radius: 50%;
    margin: 10px auto;
    line-height: 30px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: bold;
    font-size: 24px;
    cursor: pointer;
    input {
        height: 0;
        width: 0;
        opacity: 0;
    }
    :hover {
        background: ${(props) => props.theme.colors.primary};
        color: white;
    }
    .cloud {
        position: absolute;
        top: 2px;
        right: 4px;
        svg {
            width: 20px;
            height: 20px;
        }
    }
    @media (min-width: 768px) {
        width: 36px;
        height: 36px;
        .cloud {
            top: 5px;
            right: 7px;
        }
        svg {
            width: 1em;
            height: 1em;
        }
    }
`;
const MenuButton = styled.button`
    color: ${(props) => props.theme.colors.primary} !important;

    border: none;
    padding: 6px 8px;
    margin-left: 10px !important;
    margin: 10px auto;

    svg {
        width: 20px;
        height: 20px;
    }

    :hover {
        color: white !important;
        background-color: ${(props) => props.theme.colors.primary} !important;
    }
    @media (min-width: 768px) {
        svg {
            width: 1em;
            height: 1em;
        }
    }
`;
const ProfilePic = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 5px !important;
`;
const TitleDescription = styled.div`
    color: ${(props) => props.theme.colors.primary};
`;

const Title = ({ userInfo, isError, bgColor, setNightMode }) => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const { userData, setUserData } = useContext(UserContext);
    const [selectUpload, setSelectUpload] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const anchorRef = useRef(null);
    const prevOpen = useRef(openMenu);

    const handleToggle = () => {
        setOpenMenu((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpenMenu(false);
    };
    function handleListKeyDown(event) {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpenMenu(false);
        }
    }

    useEffect(() => {
        if (prevOpen.current === true && openMenu === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = openMenu;
    }, [openMenu]);

    const signIn = () => {
        auth.signInWithRedirect(provider)
            .then((res) => {
                console.log(res);
                if (res.additionalUserInfo.isNewUser) router.push("/profile");
                else {
                    router.push(`/`);
                }
            })
            .catch(alert);
    };

    const showLogin = () => {
        //Default Title Bar
        if (user == null) {
            return (
                <>
                    <Button
                        variant="contained"
                        component="span"
                        className="loginButton"
                        onClick={signIn}
                    >
                        Login
                    </Button>
                </>
            );
        } else {
            // Logged in user dashboard/homescreen
            return (
                <Control className="control">
                    <UploadButton className="uploadButton uploadLabel">
                        <input onClick={() => setSelectUpload(true)} />
                        <span className="cloud">
                            <CloudUploadIcon />
                        </span>
                    </UploadButton>
                    <MenuButton
                        ref={anchorRef}
                        aria-controls={openMenu ? "menu-list-grow" : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        style={{ backgroundColor: bgColor }}
                    >
                        <MenuIcon />
                    </MenuButton>

                    <Popper
                        open={openMenu}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                        className="menulist"
                        placement="bottom-end"
                        style={{ backgroundColor: bgColor }}
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === "bottom-end"
                                            ? "center top"
                                            : "center bottom",
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener
                                        onClickAway={handleClose}
                                    >
                                        <MenuList
                                            autoFocusItem={openMenu}
                                            id="menu-list-grow"
                                            onKeyDown={handleListKeyDown}
                                        >
                                            <MenuItem
                                                onClick={handleClose}
                                                style={{
                                                    borderBottom:
                                                        "1px solid rgba(0,0,0,0.1)",
                                                    cursor: "default",
                                                }}
                                            >
                                                <ProfilePic
                                                    src={
                                                        userData?.user?.photoURL
                                                    }
                                                    alt=""
                                                />{" "}
                                                {userData?.user?.username}
                                            </MenuItem>

                                            <MenuItem onClick={handleClose}>
                                                <Link
                                                    href={`/users/${userData?.user?.username}`}
                                                >
                                                    My Grid
                                                </Link>
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <Link href={"/profile"}>
                                                    My Account
                                                </Link>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={handleClose}
                                                style={{ color: "inherit" }}
                                            >
                                                <div
                                                    onClick={() => {
                                                        let tempNight =
                                                            localStorage.getItem(
                                                                "nightMode"
                                                            );
                                                        if (
                                                            tempNight == "true"
                                                        ) {
                                                            localStorage.setItem(
                                                                "nightMode",
                                                                false
                                                            );
                                                            setNightMode(
                                                                localStorage.getItem(
                                                                    "nightMode"
                                                                )
                                                            );
                                                        }
                                                        if (
                                                            tempNight == "false"
                                                        ) {
                                                            localStorage.setItem(
                                                                "nightMode",
                                                                true
                                                            );
                                                            setNightMode(
                                                                localStorage.getItem(
                                                                    "nightMode"
                                                                )
                                                            );
                                                        }
                                                    }}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Night Mode
                                                </div>
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <Link href={"/signout"}>
                                                    Logout
                                                </Link>
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Control>
            );
        }
    };

    const TitleDisplay = () => {
        //User is on a user gallery
        switch (router.pathname) {
            case "/tags/[tag]":
                return (
                    <TitleDescription>
                        <h2>Tag: {router.query.tag}</h2>
                    </TitleDescription>
                );
            case "/users/[username]":
                return (
                    <TitleDescription>
                        <h2>{userInfo.username}'s Grid</h2>
                        <p>{userInfo.description}</p>
                    </TitleDescription>
                );
            case "/users/404":
                return (
                    <TitleDescription>
                        <h2>Something Went Wrong</h2>
                        <p>404 ERROR - USER NOT FOUND</p>
                    </TitleDescription>
                );
            case "/":
            default:
        }
    };
    return (
        <Container>
            {selectUpload && <UploadModal setSelectUpload={setSelectUpload} />}
            <TitleBar>
                <Link href={"/"}>
                    <a>
                        <Image width={300} height={89} src={Logo} />
                    </a>
                </Link>
                {showLogin()}
            </TitleBar>
            {TitleDisplay()}
        </Container>
    );
};

export default Title;
