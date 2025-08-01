import { networkMonitor } from "@/src/core/services/network-monitor.service";
import { useSincronizacionEntregas } from "@/src/modules/visita/application/hooks/useSinconizarEntregas";
import { useSincronizacionNovedades } from "@/src/modules/visita/application/hooks/useSincronizacionNovedades";
import { useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";

export default function MainDreawerIndex() {
  const [permission, requestCamaraPermission] = useCameraPermissions();
  const [permissionResponse, requestMadiaPermission] =
    MediaLibrary.usePermissions();

  useEffect(() => {
    solicitarPermiso();
    networkMonitor.startMonitoring();

    return () => {
      networkMonitor.stopMonitoring();
    };
  }, []);

  const solicitarPermiso = async () => {
    //permiso camara
    requestCamaraPermission();
    //permiso localización
    await Location.requestForegroundPermissionsAsync();
    //permiso localización
    await Location.requestBackgroundPermissionsAsync();
    //Permiso multimedia
    await requestMadiaPermission();

    if (Platform.OS === "android") {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      } catch (error) {}
    }
  };

  return <Redirect href={"/(tabs)/(inicio)/inicio"} />;
}
