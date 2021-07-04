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
        console.log("ha");
        return;
    }
    console.log(user.uid);
    console.log(username);
    const userRef = projectFirestore.doc(`users/${user.uid}`);

    const snapshot = await userRef.get();
    console.log(snapshot);
    if (!snapshot.exists) {
        const { email, displayName, photoURL } = user;
        console.log(username);
        try {
            await userRef.set({
                displayName,
                email,
                photoURL,
                username,
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }
    return getUserDocument(user.uid);
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
