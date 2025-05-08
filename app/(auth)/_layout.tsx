import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function LoginLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="crear-cuenta"
        options={{
          title: "",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="olvido-clave"
        options={{
          title: "",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
