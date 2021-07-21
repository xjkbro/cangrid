import Link from "next/link";
import Head from "next/head";
import Button from "@material-ui/core/Button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider, projectFirestore } from "../firebase/config";
import { UserContext } from "../providers/UserContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "../public/images/candydio-white.jpg";
import UploadModal from "./UploadModal";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import MenuIcon from "@material-ui/icons/Menu";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

const Title = ({ userInfo, isError }) => {
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
                <div className="control">
                    {/* <Link href={`/users/${user.uid}`}> */}
                    <label
                        className="uploadButton uploadLabel"
                        style={{
                            display: "inline-block",
                            width: "40px",
                            height: "40px",
                            cursor: "pointer",
                        }}
                    >
                        <input onClick={() => setSelectUpload(true)}></input>
                        <span style={{ position: "absolute", top: "47px" }}>
                            <CloudUploadIcon />
                        </span>
                    </label>

                    <Button
                        ref={anchorRef}
                        aria-controls={openMenu ? "menu-list-grow" : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                    >
                        <MenuIcon fontSize="Large" />
                    </Button>
                    {/* <MenuList>
                        <MenuItem>Profile</MenuItem>
                        <MenuItem>My account</MenuItem>
                        <MenuItem>Logout</MenuItem>
                    </MenuList> */}
                    <Popper
                        open={openMenu}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === "bottom"
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
                                            <MenuItem onClick={handleClose}>
                                                <Link
                                                    href={`/users/${userData?.user?.username}`}
                                                >
                                                    My Gallery
                                                </Link>
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <Link href={"/profile"}>
                                                    My account
                                                </Link>
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
                    {/* <Link href={`/users/${userData?.user?.username}`}>
                        <Button
                            variant="contained"
                            component="span"
                            className="profileButton"
                        >
                            Your Gallery
                        </Button>
                    </Link>
                    <Link href={"/profile"}>
                        <Button
                            variant="contained"
                            component="span"
                            className="profileButton"
                        >
                            Profile
                        </Button>
                    </Link> 
                    <Link href={"/signout"}>
                        <Button
                            variant="contained"
                            component="span"
                            className="logoutButton"
                        >
                            Logout
                        </Button>
                    </Link>*/}
                </div>
            );
        }
    };

    const TitleDisplay = () => {
        //User is on a user gallery
        console.log(userData);
        switch (router.pathname) {
            case "/tags/[tag]":
                return (
                    <>
                        <h2>Tag: {router.query.tag}</h2>
                    </>
                );
            case "/users/[username]":
                return (
                    <>
                        <h2>{userInfo.username}'s Gallery</h2>
                        <p>{userInfo.description}</p>
                    </>
                );
            case "/users/404":
                return (
                    <>
                        <h2>Something Went Wrong</h2>
                    </>
                );
            case "/":
                if (userData.user != null)
                    return (
                        <>
                            <h2>The Gallery</h2>
                        </>
                    );
                else
                    return (
                        <>
                            <h2>The Gallery</h2>
                            <p>
                                Welcome to the Gallery. Please sign in to
                                continue and upload your art.
                            </p>
                        </>
                    );
            default:
        }
        // if (userInfo && !isError) {
        //     return (
        //         <>
        //             <h2>{userInfo.username}'s Gallery</h2>
        //             <p>{userInfo.description}</p>
        //         </>
        //     );
        // } else if (isError) {
        //     return (
        //         <>
        //             <h2>Something Went Wrong</h2>
        //             {/* <p></p> */}
        //         </>
        //     );
        // } else {
        //     //User is on homepage and not logged in
        //     return (
        //         <>
        //             <h2>The Gallery</h2>
        //             {userInfo ? (
        //                 <p>
        //                     Welcome to the Gallery. Please sign in to continue
        //                     and upload your art.
        //                 </p>
        //             ) : (
        //                 <></>
        //             )}
        //         </>
        //     );
        // }
    };
    return (
        <div className="title">
            <Head>
                {userInfo ? (
                    <title>{userInfo.username} | GalleryIO</title>
                ) : (
                    <>
                        <title>GalleryIO</title>
                    </>
                )}
            </Head>
            {selectUpload && <UploadModal setSelectUpload={setSelectUpload} />}
            <div className="title-bar">
                <Link href={"/"}>
                    <a>
                        <Image
                            // style={{ cursor: "pointer" }}
                            // width={200}
                            // height={50}
                            src={Logo}
                        />
                    </a>
                </Link>
                {showLogin()}
            </div>
            {TitleDisplay()}
        </div>
    );
};

export default Title;
