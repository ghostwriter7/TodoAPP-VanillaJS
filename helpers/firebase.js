import { firebaseConfig } from "../consts/firebase-config.js";
import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

export function initialize() {
    const firebase = initializeApp(firebaseConfig);
    const firestore = getFirestore(firebase);
    const auth = getAuth(firebase);

    if (location.hostname === 'localhost') {
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(firebase, 'localhost', 8080);
    }

    return { firebase, firestore, auth };
}
