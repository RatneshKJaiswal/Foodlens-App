import { StyleSheet, Text, View } from "react-native";
import { palette, spacing, typography } from "../theme";

export default function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>FoodLens AI</Text>
            <Text style={styles.subtitle}>
                Snap or upload a food photo to get ingredients, nutrition, and extra details powered by AI.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingVertical: spacing.md, gap: spacing.md },
    title: { fontSize: typography.h1, fontWeight: "800", color: palette.textPrimary },
    subtitle: { fontSize: typography.body, lineHeight: 20, color: palette.textSecondary },
});