import { tituloScreen } from "@/src/core/constants/titulo-screen.const";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { Settings } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Pressable } from "react-native";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function LoginLayout() {
  const { obtenerColor } = useTemaVisual();
  const router = useRouter(); // Hook para navegación

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
      <Stack.Screen
        name="login"
        options={{
          title: "",
          headerRight: () => (
            <Pressable onPress={() => router.push("configuracion")}>
              <Settings size={"$1.5"} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="crear-cuenta"
        options={{
          title: tituloScreen.auth.crearCuenta,
        }}
      />
      <Stack.Screen
        name="olvido-clave"
        options={{
          title: tituloScreen.auth.olvidoClave,
        }}
      />
      <Stack.Screen
        name="configuracion"
        options={{
          title: "",
          presentation: 'modal'
        }}
      />
    </Stack>
  );
}
