import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export class AuthService {
    #auth;

    constructor(auth) {
        this.#auth = auth;
    }

    async signUp(email, password) {
        try {
            await createUserWithEmailAndPassword(this.#auth, email, password);
        } catch ({ code }) {
            throw new Error(code);
        }
    }

    async signIn(email, password) {
        try {
            await signInWithEmailAndPassword(this.#auth, email, password);
        } catch ({ code }) {
            throw new Error(code);
        }
    }

    logout() {
        signOut(this.#auth);
    }
}
