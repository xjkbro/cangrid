import firebase from "firebase";
import firebaseApp from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

// var firebaseConfig = {
//     apiKey: "AIzaSyCUTGc5N1XnTVk1Fq526yUPwwlGjDEcQUU",
//     authDomain: "galleryio-next.firebaseapp.com",
//     projectId: "galleryio-next",
//     storageBucket: "galleryio-next.appspot.com",
//     messagingSenderId: "679962663284",
//     appId: "1:679962663284:web:67f64077a52b8617def421",
//     measurementId: "G-MCKN4NWZ7T",
// };

var firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT,
};

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

// firebase.analytics();
const projectStorage = app.storage();
const projectFirestore = app.firestore();
const timestamp = firebaseApp.firestore.FieldValue.serverTimestamp;
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { projectStorage, projectFirestore, timestamp, auth, provider };

export const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
};

export const generateUserDocument = async (user, username) => {
    if (!user) {
        return;
    }

    const userRef = projectFirestore.doc(`users/${user.uid}`);

    const snapshot = await userRef.get();
    if (!snapshot.exists) {
        const { email, displayName, photoURL } = user;
        let newPhotoURL = photoURL.substring(0, photoURL.length - 4);
        newPhotoURL += "900-c";
        try {
            await userRef.set({
                displayName,
                email,
                photoURL: newPhotoURL,
                username,
                description: "",
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }
    return getUserDocument(user.uid);
};

export const updateUserDocument = async (user, username, description) => {
    if (!user) {
        return;
    }
    const userRef = projectFirestore.doc(`users/${user.uid}`);

    const snapshot = await userRef.get();
    if (snapshot.exists) {
        const { photoURL } = user;
        let newPhotoURL = photoURL.substring(0, photoURL.length - 4);
        newPhotoURL += "900-c";
        if (description == undefined) description = "";
        try {
            await userRef.update({
                username: username,
                description: description,
                photoURL: newPhotoURL,
            });
        } catch (error) {
            console.error("Error updating user document", error);
        }
    }
    return getUserDocument(user.uid);
};
export const addImgComment = async (user, image, comment) => {
    const { userData, id } = image;
    console.log(comment);
    //update images collection
    const imageRef = projectFirestore.doc(`images/${id}`);
    const snapshotImgCollection = await imageRef.get();
    let newComments = snapshotImgCollection.data().comments;
    console.log(newComments);
    newComments.push({ user, comment });
    console.log(newComments);

    if (snapshotImgCollection.exists) {
        try {
            await imageRef.update({
                comments: newComments,
            });
        } catch (error) {
            console.error("Error adding comment to document", error);
        }
    }
    //update users/images collection
    return newComments
};
export const imgLike = async (image) => {
    const { userData, id } = image;
    //update images collection
    const imageRef = projectFirestore.doc(`images/${id}`);
    const snapshotImgCollection = await imageRef.get();
    let likeCount = snapshotImgCollection.data().likes ;
    likeCount++;
    console.log(likeCount);
    if (snapshotImgCollection.exists) {
        try {
            await imageRef.update({
                likes: likeCount,
            });
        } catch (error) {
            console.error("Error adding comment to document", error);
        }
    }
    //update users/images collection
    return likeCount
};
const getUserDocument = async (uid) => {
    if (!uid) return null;
    try {
        const userDocument = await projectFirestore.doc(`users/${uid}`).get();
        return {
            uid,
            ...userDocument.data(),
        };
    } catch (error) {
        console.error("Error fetching user", error);
    }
};

export const getUsernameDoc = async (username) => {
    if (!username) return null;
    let found = false;
    try {
        const userDocument = await projectFirestore
            .collection(`users`)
            .get()
            .then((snap) => {
                snap.forEach((doc) => {
                    if (doc.get("username") == username) {
                        console.log(doc.get("username"));
                        found = true;
                    }
                });
            });
    } catch (error) {
        console.error("Error fetching user", error);
    }
    return found;
};
