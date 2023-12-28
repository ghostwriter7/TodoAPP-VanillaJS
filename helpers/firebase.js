import { firebaseConfig } from "../consts/firebase-config.js";
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export function initialize() {
    const firebase = initializeApp(firebaseConfig);
    const firestore = getFirestore(firebase);
    const auth = getAuth(firebase);
    return { firebase, firestore, auth };
}
