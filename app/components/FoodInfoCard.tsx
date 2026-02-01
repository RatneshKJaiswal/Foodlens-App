import { StyleSheet, Text, View } from "react-native";
import { palette, radii, spacing, typography } from "../theme";
import { FoodResult, ResultState } from "../types/food";
import { Info, Utensils } from "lucide-react-native";

export default function FoodInfoCard({ result }: { result: ResultState }) {
    if (!result) return (
        <View style={styles.placeholder}>
            <Info size={24} color={palette.textMuted} />
            <Text style={styles.placeholderText}>Results will appear here after analysis.</Text>
        </View>
    );

    if ("error" in result) return (
        <View style={styles.errorBox}>
            <Text style={styles.errorText}>{result.error}</Text>
        </View>
    );

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Utensils size={20} color={palette.primary} />
                <Text style={styles.name}>{result.name}</Text>
            </View>
            <Text style={styles.cuisine}>{result.cuisine} Cuisine</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>Nutritional Summary</Text>
            <View style={styles.grid}>
                {Object.entries(result.nutritionalInfo).map(([key, val]) => (
                    <View key={key} style={styles.gridItem}>
                        <Text style={styles.gridKey}>{key}</Text>
                        <Text style={styles.gridVal}>{val}</Text>
                    </View>
                ))}
            </View>

            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Description & Taste</Text>
            <Text style={styles.bodyText}>{result.details.taste || "No description available."}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: palette.surface, borderRadius: radii.lg, padding: spacing.xl, borderWidth: 1, borderColor: palette.border },
    placeholder: { padding: 40, alignItems: "center", gap: 12, opacity: 0.6 },
    placeholderText: { color: palette.textMuted, textAlign: "center" },
    header: { flexDirection: "row", alignItems: "center", gap: 10 },
    name: { color: palette.textPrimary, fontSize: 24, fontWeight: "900" },
    cuisine: { color: palette.primary, fontWeight: "700", textTransform: "uppercase", fontSize: 12, marginTop: 4 },
    divider: { height: 1, backgroundColor: palette.border, marginVertical: 16 },
    sectionLabel: { color: palette.textSecondary, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    gridItem: { backgroundColor: palette.surfaceAlt, padding: 12, borderRadius: radii.sm, minWidth: "45%", flex: 1, borderWidth: 1, borderColor: palette.border },
    gridKey: { color: palette.textMuted, fontSize: 10, textTransform: "capitalize" },
    gridVal: { color: palette.textPrimary, fontWeight: "800", fontSize: 14, marginTop: 2 },
    bodyText: { color: palette.textSecondary, lineHeight: 20 },
    errorBox: { backgroundColor: palette.errorBg, padding: 16, borderRadius: radii.md },
    errorText: { color: palette.errorTitle, fontWeight: "600" }
});