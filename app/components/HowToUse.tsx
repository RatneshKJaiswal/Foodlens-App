import { StyleSheet, Text, View } from "react-native";
import { palette, radii, spacing, typography } from "../theme";

const STEPS = [
    { title: "Snap a Photo", desc: "Capture a clear image (good lighting helps a lot)." },
    { title: "AI Analysis", desc: "The model identifies the dish and extracts nutrition data." },
    { title: "Get Insights", desc: "See ingredients, cuisine, and additional cooking details." },
] as const;

export default function HowToUse() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>How to Use FoodLens AI</Text>
            <View style={styles.grid}>
                {STEPS.map((step) => (
                    <View key={step.title} style={styles.stepCard}>
                        <Text style={styles.stepTitle}>{step.title}</Text>
                        <Text style={styles.stepDesc}>{step.desc}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: spacing.md, marginTop: spacing.sm },
    title: { color: palette.textPrimary, fontSize: typography.h3, fontWeight: "800" },
    grid: { gap: spacing.md },
    stepCard: {
        backgroundColor: palette.surfaceAlt,
        borderRadius: radii.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: palette.border,
        gap: spacing.xs,
    },
    stepTitle: { color: palette.textPrimary, fontWeight: "800" },
    stepDesc: { color: palette.textSecondary, lineHeight: 18 },
});