import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export class AuthService {
    #auth;

    constructor(auth) {
        this.#auth = auth;
    }

    signUp(email, password) {
        createUserWithEmailAndPassword(this.#auth, email, password);
    }

    signIn(email, password) {
        signInWithEmailAndPassword(this.#auth, email, password);
    }

    logout() {
        signOut(this.#auth);
    }
}
