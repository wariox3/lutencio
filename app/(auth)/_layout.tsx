import { tituloScreen } from "@/src/core/constants/titulo-screen.const";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function LoginLayout() {
  const { obtenerColor } = useTemaVisual();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: obtenerColor(
            "HEADER_BACKGROUND_COLOR_LIGHT",
            "HEADER_BACKGROUND_COLOR_DARK"
          ),
        },
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: obtenerColor("NEGRO", "BLANCO"),
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
