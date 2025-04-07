import { useCameraPermissions } from "expo-camera";
import { useEffect } from "react";
import {
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import EntregaUbicacion from "@/components/ui/entrega/entregaUbicacion";
import EntregaCardDespachoCargado from "@/components/ui/entrega/EntregaCardDespachoCargado";

export default function MainDreawerIndex() {
  const [permission, requestCamaraPermission] = useCameraPermissions();
  const [permissionResponse, requestMadiaPermission] =
    MediaLibrary.usePermissions();

  useEffect(() => {
    solicitarPermiso();
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <EntregaCardDespachoCargado></EntregaCardDespachoCargado>
          <EntregaUbicacion></EntregaUbicacion>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
