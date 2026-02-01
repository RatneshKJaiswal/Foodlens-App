import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import type { Models } from "react-native-appwrite";
import { LogOut, User as UserIcon } from "lucide-react-native";
import Header from "./components/Header";
import UploadCard from "./components/UploadCard";
import FoodInfoCard from "./components/FoodInfoCard";
import HowToUse from "./components/HowToUse";
import Footer from "./components/Footer";
import CameraModal from "./components/CameraModal";
import { useFoodLens } from "./hooks/useFoodLens";
import { restoreSessionUser, signOut } from "./services/authService";
import { palette, radii, spacing, typography } from "./theme";

export default function Index() {
    const router = useRouter();
    const [checkingSession, setCheckingSession] = useState(true);
    const [currentUser, setCurrentUser] = useState<Models.User<Models.Preferences> | null>(null);
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    const {
        imageUri,
        canAnalyze,
        loading,
        result,
        cameraOpen,
        pickFromGallery,
        openCamera,
        identifyFood,
        handleImageCaptured,
        closeCamera,
    } = useFoodLens(apiKey);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const profile = await restoreSessionUser();
                if (active) {
                    if (profile) setCurrentUser(profile);
                    else router.replace("/auth");
                }
            } catch {
                if (active) router.replace("/auth");
            } finally {
                if (active) setCheckingSession(false);
            }
        })();
        return () => { active = false; };
    }, [router]);

    const handleSignOut = async () => {
        Alert.alert("Sign Out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                    try {
                        await signOut();
                        setCurrentUser(null);
                        router.replace("/auth");
                    } catch {
                        Alert.alert("Error", "Failed to sign out.");
                    }
                }
            }
        ]);
    };

    if (checkingSession) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color={palette.primary} />
                    <Text style={styles.loadingText}>Initializing FoodLens AI...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!currentUser) return null;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.topBar}>
                    <View style={styles.userSection}>
                        <View style={styles.avatarCircle}><UserIcon size={20} color={palette.primary} /></View>
                        <View>
                            <Text style={styles.greeting}>Hello, {currentUser.name.split(' ')[0] || "User"}</Text>
                            <Text style={styles.statusLabel}>Premium Member</Text>
                        </View>
                    </View>
                    <Pressable style={styles.signOutIconButton} onPress={handleSignOut}>
                        <LogOut size={22} color={palette.textSecondary} />
                    </Pressable>
                </View>
                <Header />
                <View style={styles.mainContent}>
                    <UploadCard imageUri={imageUri} canAnalyze={canAnalyze} loading={loading} onPickFromGallery={pickFromGallery} onOpenCamera={openCamera} onIdentify={identifyFood} />
                    <FoodInfoCard result={result} />
                </View>
                <HowToUse />
                <Footer />
            </ScrollView>
            <CameraModal visible={cameraOpen} onRequestClose={closeCamera} onCaptured={handleImageCaptured} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: palette.background },
    container: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
    loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md },
    loadingText: { color: palette.textSecondary, fontSize: 16, fontWeight: "500" },
    topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.xxl, marginBottom: spacing.md },
    userSection: { flexDirection: "row", alignItems: "center", gap: spacing.md },
    avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(37, 99, 235, 0.15)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(37, 99, 235, 0.2)" },
    greeting: { color: palette.textPrimary, fontWeight: "900", fontSize: 20 },
    statusLabel: { color: palette.primary, fontSize: 12, fontWeight: "700", textTransform: "uppercase" },
    signOutIconButton: { padding: 10, backgroundColor: palette.surface, borderRadius: 14, borderWidth: 1, borderColor: palette.border },
    mainContent: { gap: spacing.xxl, marginBottom: spacing.xxxl },
});