import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { CameraView } from "expo-camera";
import { palette, radii, spacing } from "../theme";

type CameraModalProps = {
    visible: boolean;
    onRequestClose: () => void;
    onCaptured: (uri: string, base64: string) => void;
};

export default function CameraModal({ visible, onRequestClose, onCaptured }: CameraModalProps) {
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

    useEffect(() => {
        if (!visible) {
            setCameraReady(false);
            setCameraRef(null);
        }
    }, [visible]);

    const takePhoto = async () => {
        try {
            if (!cameraRef || !cameraReady) {
                return;
            }

            const photo = await cameraRef.takePictureAsync({ base64: true, quality: 0.9 });

            if (!photo?.uri || !photo.base64) {
                Alert.alert("Capture failed", "Could not read image data. Please try again.");
                return;
            }

            onCaptured(photo.uri, photo.base64);
        } catch {
            Alert.alert("Capture failed", "Please try again.");
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onRequestClose}>
            <SafeAreaView style={styles.safe}>
                <View style={styles.topBar}>
                    <Pressable style={[styles.button, styles.secondaryButton]} onPress={onRequestClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </Pressable>
                </View>

                <View style={styles.cameraWrap}>
                    <CameraView
                        ref={(ref) => setCameraRef(ref)}
                        style={styles.camera}
                        facing="back"
                        onCameraReady={() => setCameraReady(true)}
                    />
                </View>

                <View style={styles.bottomBar}>
                    <Pressable
                        style={[styles.button, !cameraReady && styles.buttonDisabled]}
                        onPress={takePhoto}
                        disabled={!cameraReady}
                    >
                        <Text style={styles.buttonText}>{cameraReady ? "Take Photo" : "Starting Camera..."}</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#000" },
    topBar: { padding: spacing.xl },
    cameraWrap: { flex: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
    camera: { flex: 1, borderRadius: radii.lg, overflow: "hidden" },
    bottomBar: { padding: spacing.xl },
    button: {
        backgroundColor: palette.primary,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xxl,
        borderRadius: radii.sm,
    },
    secondaryButton: { backgroundColor: palette.secondary },
    buttonText: { color: palette.textPrimary, fontWeight: "700", textAlign: "center" },
    buttonDisabled: { opacity: 0.5 },
});