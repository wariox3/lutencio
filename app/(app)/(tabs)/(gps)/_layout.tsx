import { Stack } from "expo-router";
import BtnMenuDrewer from "@/src/shared/components/btn-menu-drewer";
import COLORES from "@/src/core/constants/colores";

export default function GpsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        title: "",
        headerStyle: {
          backgroundColor: COLORES.HEADER_BACKGROUND_COLOR
        },
      }}
    >
      <Stack.Screen
        name="mapa"
        options={{
          headerLeft: () => <BtnMenuDrewer />,
        }}
      />
      <Stack.Screen name="entregar" options={{ headerShown: true }} />
      <Stack.Screen name="novedad" options={{ headerShown: true }} />
    </Stack>
  );
}
