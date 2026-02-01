import { account, appwriteClient } from "./appwriteClient";
import { saveAppwriteSession, clearAppwriteSession } from "./sessionStorage";

export async function signUpWithEmail({ name, email, password }: any) {
    // Creates a new account and then signs them in to create a session
    await account.create('unique()', email, password, name);
    return signInWithEmail({ email, password });
}

export async function signInWithEmail({ email, password }: any) {
    // Standard email/password session creation
    const session = await account.createEmailPasswordSession(email, password);
    appwriteClient.setSession(session.$id);
    await saveAppwriteSession(session.$id);
    return account.get();
}

export async function signOut() {
    try {
        await account.deleteSession('current');
    } finally {
        await clearAppwriteSession();
    }
}

export async function getCurrentUser() {
    return await account.get();
}

export async function restoreSessionUser() {
    try {
        return await account.get();
    } catch {
        return null;
    }
}