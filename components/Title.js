import Link from "next/link";
import Head from "next/head";
import Button from "@material-ui/core/Button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider, projectFirestore } from "../firebase/config";
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
                        <span style={{ position: "absolute", top: "50px" }}>
                            <CloudUploadIcon />
                        </span>
                    </label>

                    <Button
                        ref={anchorRef}
                        aria-controls={openMenu ? "menu-list-grow" : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        // style={{ color: "#89b0ae" }}
                        className="menuButton"
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
                        className="menulist"
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
                                                    My Grid
                                                </Link>
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <Link href={"/profile"}>
                                                    My Account
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
                </div>
            );
        }
    };

    const TitleDisplay = () => {
        //User is on a user gallery
        console.log(user);
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
                        <h2>{userInfo.username}'s Grid</h2>
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
            // if (user != null)
            //     return (
            //         <>
            //             <h2>The Gallery</h2>
            //         </>
            //     );
            // else
            //     return (
            //         <>
            //             <h2>The Gallery</h2>
            //             <p>
            //                 Welcome to the Gallery. Please sign in to
            //                 continue and upload your art.
            //             </p>
            //         </>
            //     );
            default:
        }
    };
    return (
        <div className="title">
            <Head>
                {userInfo ? (
                    <title>{userInfo.username} | Cangrid</title>
                ) : (
                    <>
                        <title>Cangrid</title>
                    </>
                )}
            </Head>
            {selectUpload && <UploadModal setSelectUpload={setSelectUpload} />}
            <div className="title-bar">
                <Link href={"/"}>
                    <a>
                        <Image
                            // style={{ cursor: "pointer" }}
                            width={300}
                            height={89}
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
