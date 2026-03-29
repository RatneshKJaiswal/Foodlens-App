import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { generateDynamicDietPlan } from "../services/dietPlanner";
import { palette } from "../theme";

export default function DietPlanner({ apiKey, userStats }: any) {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("Mon");

  const fetchPlan = async () => {
    setLoading(true);
    const data = await generateDynamicDietPlan(apiKey, userStats);
    setPlan(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlan();
  }, [userStats]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );

  // Safety Check: If plan failed, show a retry button
  if (!plan || !plan.days)
    return (
      <View style={styles.center}>
        <Text style={{ color: "#94A3B8", marginBottom: 15 }}>
          Could not generate plan.
        </Text>
        <TouchableOpacity onPress={fetchPlan} style={styles.retryBtn}>
          <Text style={{ color: "#FFF", fontWeight: "bold" }}>
            Retry Generation
          </Text>
        </TouchableOpacity>
      </View>
    );

  const currentDayMeals = plan.days[selectedDay] || [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text style={styles.header}>
        AI <Text style={{ color: palette.primary }}>Coach</Text>
      </Text>

      {/* Target Card */}
      <View style={styles.targetCard}>
        <Text style={styles.targetTitle}>
          {plan.analysis?.calories} kcal/day
        </Text>
        <Text style={styles.targetReason}>{plan.analysis?.reasoning}</Text>
      </View>

      {/* Day Picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dayStrip}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => setSelectedDay(day)}
            style={[styles.dayTab, selectedDay === day && styles.activeTab]}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === day && styles.activeDayText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Meal Mapping */}
      {currentDayMeals.map((item: any, i: number) => (
        <View key={i} style={styles.mealCard}>
          <MaterialCommunityIcons
            name={item.icon || "food"}
            size={24}
            color={palette.primary}
          />
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.mealType}>{item.type}</Text>
            <Text style={styles.mealName}>{item.meal}</Text>
          </View>
          <Text style={styles.kcalText}>{item.kcal} kcal</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 20 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },
  header: { fontSize: 28, fontWeight: "900", color: "#FFF", marginBottom: 20 },
  targetCard: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  targetTitle: { color: palette.primary, fontSize: 20, fontWeight: "800" },
  targetReason: { color: "#94A3B8", fontSize: 13, marginTop: 5 },
  dayStrip: { marginBottom: 20 },
  dayTab: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#1E293B",
    marginRight: 10,
  },
  activeTab: { backgroundColor: palette.primary },
  dayText: { color: "#94A3B8" },
  activeDayText: { color: "#FFF", fontWeight: "bold" },
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  mealType: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  mealName: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  kcalText: { color: palette.primary, fontWeight: "bold" },
  retryBtn: { backgroundColor: palette.primary, padding: 12, borderRadius: 10 },
});
