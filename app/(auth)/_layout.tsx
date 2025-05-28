import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import COLORES from "@/src/core/constants/colores";
import { tituloScreen } from "@/src/core/constants/titulo-screen.const";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function LoginLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORES.HEADER_BACKGROUND_COLOR,
        },
        headerLargeTitle: true,
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: 'black',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="crear-cuenta"
        options={{
          title: tituloScreen.auth.crearCuenta
        }}
      />
      <Stack.Screen
        name="olvido-clave"
        options={{
          title: tituloScreen.auth.olvidoClave,
        }}
      />
    </Stack>
  );
}
