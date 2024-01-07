import { firebaseConfig } from "@consts/firebase-config";
import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

export class Firebase {
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
