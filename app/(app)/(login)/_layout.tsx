import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function LoginLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
    screenOptions={{
      headerShadowVisible: false,
      headerTransparent: true,
    }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="CrearCuenta"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="OlvidoClave"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
}
