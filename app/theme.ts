import { Platform } from "react-native";

export const palette = {
    background: "#0B1220",
    surface: "#111B2E",
    surfaceAlt: "#0F1A2D",
    border: "rgba(255,255,255,0.08)",
    primary: "#2563EB",
    // New Standardized Opacities
    primarySoft: "rgba(37, 99, 235, 0.1)",  // 10% opacity (used in UploadCard, Profile)
    primaryMedium: "rgba(37, 99, 235, 0.15)", // 15% opacity (used in Avatar)
    secondary: "#334155",
    textPrimary: "#E8EEF9",
    textSecondary: "#B7C4DD",
    textMuted: "#93A4C7",
    tableRow: "rgba(255,255,255,0.03)",
    errorBg: "rgba(239,68,68,0.12)",
    errorTitle: "#FCA5A5",
    errorText: "#FECACA",
    successBg: "rgba(34, 197, 94, 0.1)", // Standardized success background
};

export const spacing = {
    xs: 6,
    sm: 8,
    md: 10,
    lg: 12,
    xl: 14,
    xxl: 16,
    xxxl: 20,
};

export const radii = {
    sm: 12,
    md: 14,
    lg: 16,
};

export const typography = {
    h1: 34,
    h2: 20,
    h3: 18,
    body: 14.5,
    caption: 13.5,
};