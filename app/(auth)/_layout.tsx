import { tituloScreen } from "@/src/core/constants/titulo-screen.const";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { Settings } from "@tamagui/lucide-icons";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Pressable, TouchableOpacity, View } from "react-native";
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
            <TouchableOpacity 
              onPressIn={() => router.push("configuracion")}
              activeOpacity={0.7}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                borderRadius: 20,
}}>
                <Settings size={"$1.5"} />
              </View>
            </TouchableOpacity>
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
