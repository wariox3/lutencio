import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { PermissionsAndroid, Platform } from "react-native";

export const usePermisos = () => {
    const validarPermisos = async (): Promise<boolean> => {
        try {
            // Permiso cámara
            const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
            if (camStatus !== "granted") {
                return false;
            }

            // Permiso ubicación foreground
            const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
            if (locStatus !== "granted") {
                return false;
            }

            // Permiso ubicación background
            const { status: bgLocStatus } = await Location.requestBackgroundPermissionsAsync();
            if (bgLocStatus !== "granted") {
                return false;
            }

            // Permiso multimedia
            const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
            if (mediaStatus !== "granted") {
                return false;
            }

            // Permiso notificaciones solo en Android
            if (Platform.OS === "android") {
                const notifStatus = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );
                if (notifStatus !== PermissionsAndroid.RESULTS.GRANTED) {
                    return false;
                }
            }
            return true;
        } catch (error) {
            return false;
        }
    };

    return { validarPermisos };
};
