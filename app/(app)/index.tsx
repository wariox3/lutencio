import { useSincronizacionEntregas } from "@/src/modules/visita/application/hooks/useSinconizarEntregas";
import { useSincronizacionNovedades } from "@/src/modules/visita/application/hooks/useSincronizacionNovedades";
import { useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import {
  PermissionsAndroid,
  Platform
} from "react-native";
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

export default function MainDreawerIndex() {
  const [permission, requestCamaraPermission] = useCameraPermissions();
  const [permissionResponse, requestMadiaPermission] =
    MediaLibrary.usePermissions();

  useEffect(() => {
    solicitarPermiso();
  }, []);

  useSincronizacionNovedades();
  useSincronizacionEntregas();

  const solicitarPermiso = async () => {
    //permiso camara
    requestCamaraPermission();
    //permiso localización
    if(Platform.OS === "ios"){
      await requestTrackingPermissionsAsync();
    }
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
