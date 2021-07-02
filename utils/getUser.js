const getUser = (users, userLoggedIn) =>
    users?.filter((userToFilter) => userToFilter !== userLoggedIn?.email)[0];

export default getUser;

import useFirestore from "../hooks/useFirestore";
import { motion } from "framer-motion";
import { auth, projectFirestore } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const getUser = ({ uid }) => {
    const unsub = projectFirestore.collection("users").doc({ uid }).get();
    return { unsub };
};
