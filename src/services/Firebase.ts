import { firebaseConfig } from "@consts/firebase-config";
import type { FirebaseApp } from 'firebase/app';
import { initializeApp } from 'firebase/app'
import type { Firestore } from 'firebase/firestore';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

export class Firebase {
    readonly firebase: FirebaseApp;
    readonly firestore: Firestore;
    readonly auth: Auth;

    constructor() {
        this.firebase = initializeApp(firebaseConfig);
        this.firestore = getFirestore(this.firebase);
        this.auth = getAuth(this.firebase);

        if (location.hostname === 'localhost') {
            connectAuthEmulator(this.auth, 'http://localhost:9099', { disableWarnings: true });
            connectFirestoreEmulator(this.firestore, 'localhost', 8080);
        }
    }
}
