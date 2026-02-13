import { account, appwriteClient } from "./appwriteClient";
import { saveAppwriteSession, clearAppwriteSession } from "./sessionStorage";
// Import the new types
import { UserPrefs, UserWithPrefs } from "../types/user";

export async function signUpWithEmail({ name, email, password }: any) {
    await account.create('unique()', email, password, name);
    return signInWithEmail({ email, password });
}

export async function signInWithEmail({ email, password }: any) {
    const session = await account.createEmailPasswordSession(email, password);
    appwriteClient.setSession(session.$id);
    await saveAppwriteSession(session.$id);
    return account.get<UserPrefs>();
}

export async function signOut() {
    try {
        await account.deleteSession('current');
    } finally {
        await clearAppwriteSession();
    }
}

// Core function to fetch user
export async function getCurrentUser() {
    return await account.get<UserPrefs>();
}

// Refactored to reuse getCurrentUser logic
export async function restoreSessionUser() {
    try {
        return await getCurrentUser();
    } catch {
        return null;
    }
}

// Update User Preferences in Appwrite
export async function updateUserPreferences(prefs: UserPrefs) {
    return await account.updatePrefs(prefs);
}