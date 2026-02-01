// app/hooks/useFoodLens.ts
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useCameraPermissions } from "expo-camera";
import { analyzeFoodImage } from "../services/foodAnalyzer";
import { ResultState } from "../types/food";

export function useFoodLens(apiKey?: string) {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [result, setResult] = useState<ResultState>(null);
    const [loading, setLoading] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    const canAnalyze = useMemo(() => Boolean(imageBase64 && !loading), [imageBase64, loading]);

    // Helper to strip prefix if present
    const cleanBase64 = (base64: string) => {
        return base64.replace(/^data:image\/(png|jpeg|webp);base64,/, "");
    };

    const pickFromGallery = useCallback(async () => {
        setResult(null);
        const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!mediaPermission.granted) {
            Alert.alert("Permission needed", "Allow library access to upload images.");
            return;
        }

        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0.8, // Slightly lower quality for faster upload/processing
        });

        if (!res.canceled && res.assets?.[0]?.base64) {
            setImageUri(res.assets[0].uri);
            setImageBase64(cleanBase64(res.assets[0].base64));
        }
    }, []);

    const openCamera = useCallback(async () => {
        setResult(null);
        if (!permission?.granted) {
            const next = await requestPermission();
            if (!next.granted) return;
        }
        setCameraOpen(true);
    }, [permission, requestPermission]);

    const identifyFood = useCallback(async () => {
        if (!imageBase64) return;
        if (!apiKey) {
            setResult({ error: "API Key missing. Please check your .env file." });
            return;
        }

        setLoading(true);
        try {
            const parsed = await analyzeFoodImage({ apiKey, imageBase64 });
            setResult(parsed);
        } catch (error: any) {
            console.error("Analysis Error:", error);
            setResult({ error: error.message || "Failed to identify food. Try again." });
        } finally {
            setLoading(false);
        }
    }, [apiKey, imageBase64]);

    const handleImageCaptured = useCallback((uri: string, base64: string) => {
        setImageUri(uri);
        setImageBase64(cleanBase64(base64));
        setCameraOpen(false);
        setResult(null);
    }, []);

    const closeCamera = useCallback(() => setCameraOpen(false), []);

    return { imageUri, result, loading, cameraOpen, canAnalyze, pickFromGallery, openCamera, identifyFood, handleImageCaptured, closeCamera };
}