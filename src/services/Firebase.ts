import { firebaseConfig } from "../consts/firebase-config.js";
import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

class Firebase {
    #firebase;
    #firestore;
    #auth;


    get firestore() {
        return this.#firestore;
    }

    get auth() {
        return this.#auth;
    }

    constructor() {
        this.#firebase = initializeApp(firebaseConfig);
        this.#firestore = getFirestore(this.#firebase);
        this.#auth = getAuth(this.#firebase);

        if (location.hostname === 'localhost') {
            connectAuthEmulator(this.#auth, 'http://localhost:9099', { disableWarnings: true });
            connectFirestoreEmulator(this.#firestore, 'localhost', 8080);
        }

    }
}

export default new Firebase();
