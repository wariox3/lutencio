import { themes } from "@/assets/theme/themes";
import { persistor, store } from "@/src/application/store";
import COLORES from "@/src/core/constants/colores.constant";
import { initializeServices } from "@/src/core/services/init-services";
import AlertDialogGlobal from "@/src/shared/components/comun/alert-dialog-global";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { defaultConfig } from "@tamagui/config/v4";
import { TamaguiProvider, createTamagui } from "@tamagui/core";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { PortalProvider } from "tamagui";

// you usually export this from a tamagui.config.ts file
const config = createTamagui({
  ...themes,
  ...defaultConfig,
});

type Conf = typeof config;

// make imports typed
declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends Conf {}
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { esquemaActual, obtenerColor } = useTemaVisual();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Inicializar servicios al cargar la aplicación
  useEffect(() => {
    // Inicializar servicios (token, auth, etc.)
    initializeServices();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const LightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: COLORES.BLANCO,
    },
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TamaguiProvider config={config} defaultTheme={esquemaActual!}>
          <ThemeProvider value={esquemaActual ? DarkTheme : LightTheme}>
            <PortalProvider>
              <StatusBar
                barStyle="default"
                backgroundColor={obtenerColor(
                  "HEADER_BACKGROUND_COLOR_LIGHT",
                  "HEADER_BACKGROUND_COLOR_DARK"
                )}
              />
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="(app)" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <AlertDialogGlobal></AlertDialogGlobal>
              </GestureHandlerRootView>
            </PortalProvider>
          </ThemeProvider>
        </TamaguiProvider>
      </PersistGate>
    </Provider>
  );
}
