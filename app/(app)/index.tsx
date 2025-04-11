import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const comprobarToken = async () => {
      const token = await AsyncStorage.getItem("jwtToken");
      if (token) {
        router.replace("/(app)/(maindreawer)/(tabs)/(inicio)"); // o la pantalla principal
      } else {
        router.replace("/(app)/(login)/index"); // o tu ruta de login exacta
      }
    };

    comprobarToken();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}