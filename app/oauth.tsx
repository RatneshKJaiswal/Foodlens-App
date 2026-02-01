import { ActivityIndicator, SafeAreaView, StyleSheet, Text } from "react-native";
import { palette, spacing } from "./theme";

// This screen just keeps the app open while authService processes the URL
export default function OAuthRedirectScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <ActivityIndicator color={palette.textPrimary} />
            <Text style={{ color: palette.textSecondary, marginTop: 10 }}>
                Please wait...
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: palette.background,
        justifyContent: "center",
        alignItems: "center"
    },
});