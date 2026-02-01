import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
// Import subscribeToSessionChange
import { restoreAppwriteSession, subscribeToSessionChange } from "./services/sessionStorage";



export default function RootLayout() {
    const [isHydrated, setIsHydrated] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const segments = useSegments();
    const router = useRouter();


    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                await SplashScreen.preventAutoHideAsync();
            } catch {
                // already prevented elsewhere; ignore
            }

            const restored = await restoreAppwriteSession().catch((error) => {
                console.warn("[Auth] Failed to restore Appwrite session", error);
                return false;
            });

            if (!isMounted) return;

            setIsSignedIn(restored);
            setIsHydrated(true);
            void SplashScreen.hideAsync();
        })();

        const unsubscribe = subscribeToSessionChange((status) => {
            setIsSignedIn(status);
        });
        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        const inAuthGroup = segments[0] === "auth";

        if (isSignedIn && inAuthGroup) {
            // If logged in but on login page -> Go Home
            router.replace("/");
        } else if (!isSignedIn && !inAuthGroup) {
            // If logged out but on home page -> Go Login
            router.replace("/auth");
        }
    }, [isHydrated, isSignedIn, segments, router]);

    if (!isHydrated) {
        return null;
    }

    return <Slot />;
}