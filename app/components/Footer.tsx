import { StyleSheet, Text, View } from "react-native";
import { palette, spacing } from "../theme";

export default function Footer() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>FoodLens AI</Text>
            <Text style={styles.text}>© 2026 FoodLens AI. All rights reserved.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.md,
        paddingVertical: spacing.xxl,
        borderTopWidth: 1,
        borderTopColor: palette.border,
        gap: spacing.sm,
    },
    title: { color: palette.textPrimary, fontWeight: "900" },
    text: { color: palette.textMuted },
});