import { useCameraPermissions } from "expo-camera";
import { useEffect } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView
} from "react-native";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";


export default function MainDreawerIndex() {

  const [permission, requestCamaraPermission] = useCameraPermissions();
  const [permissionResponse, requestMadiaPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    solicitarPermiso()
  }, []);

  const solicitarPermiso = async ()=>{
    //permiso camara
    requestCamaraPermission()
    //permiso localización
    await Location.requestForegroundPermissionsAsync();
    //permiso localización
    await Location.requestBackgroundPermissionsAsync();
    //Permiso multimedia
    await requestMadiaPermission()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
