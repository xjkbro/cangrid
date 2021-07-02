import firebase from "firebase";
import firebaseApp from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyDROQfNz6R1puQoDgqIz6YtuJ0mydXuBbU",
    authDomain: "galleryio-844c0.firebaseapp.com",
    projectId: "galleryio-844c0",
    storageBucket: "galleryio-844c0.appspot.com",
    messagingSenderId: "608565928469",
    appId: "1:608565928469:web:45e48427df6a6e4907a41c",
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const projectStorage = app.storage();
const projectFirestore = app.firestore();
const timestamp = firebaseApp.firestore.FieldValue.serverTimestamp;
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { projectStorage, projectFirestore, timestamp, auth, provider };
