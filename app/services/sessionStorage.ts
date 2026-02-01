import * as SecureStore from "expo-secure-store";
import { account, appwriteClient } from "./appwriteClient";

const SESSION_KEY = "appwrite_session_id";
let cachedSessionId: string | null | undefined = undefined;

type SessionListener = (signedIn: boolean) => void;
const sessionListeners = new Set<SessionListener>();

function notifySessionListeners(signedIn: boolean) {
    sessionListeners.forEach((listener) => listener(signedIn));
}

export function subscribeToSessionChange(listener: SessionListener) {
    sessionListeners.add(listener);
    return () => sessionListeners.delete(listener);
}

export async function saveAppwriteSession(sessionId: string) {
    cachedSessionId = sessionId;
    await SecureStore.setItemAsync(SESSION_KEY, sessionId);
    notifySessionListeners(true);
}

export async function loadAppwriteSession(): Promise<string | null> {
    if (cachedSessionId === undefined) {
        cachedSessionId = await SecureStore.getItemAsync(SESSION_KEY);
    }

    return cachedSessionId ?? null;
}

export async function clearAppwriteSession() {
    cachedSessionId = null;
    await SecureStore.deleteItemAsync(SESSION_KEY);
    notifySessionListeners(false);
}

export async function restoreAppwriteSession(): Promise<boolean> {
    const sessionId = await loadAppwriteSession();

    if (!sessionId) {
        notifySessionListeners(false);
        return false;
    }

    appwriteClient.setSession(sessionId);

    try {
        await account.get();
        notifySessionListeners(true);
        return true;
    } catch {
        await clearAppwriteSession();
        notifySessionListeners(false);
        return false;
    }
}