import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Auth } from '@firebase/auth';
import { Firebase, Injector } from "@services/index";

export class AuthService {
    private readonly auth: Auth;

    constructor() {
        this.auth = Injector.resolve(Firebase).auth;
    }

    async signUp(email: string, password: string): Promise<void> {
        try {
            await createUserWithEmailAndPassword(this.auth, email, password);
        } catch ({ code }) {
            throw new Error(code);
        }
    }

    async signIn(email: string, password: string): Promise<void> {
        try {
            await signInWithEmailAndPassword(this.auth, email, password);
        } catch ({ code }) {
            throw new Error(code);
        }
    }

    logout(): void {
        signOut(this.auth);
    }
}
