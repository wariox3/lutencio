import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

export default function AppLayout() {
  const router = useRouter(); // Hook para manejar navegación

  useEffect(() => {
    getData()

  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        router.replace("/(app)/(maindreawer)"); // Navega a la pantalla si el token existe
        
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  };

  return (
    <Stack>
      <Stack.Screen name="(login)" options={{ headerShown: false }} />
      <Stack.Screen name="(maindreawer)" options={{ headerShown: false }} />
    </Stack>
  );
}
