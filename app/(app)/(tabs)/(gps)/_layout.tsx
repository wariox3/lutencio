import { Stack } from "expo-router";
import BtnMenuDrewer from "@/src/shared/components/btn-menu-drewer";
import COLORES from "@/src/core/constants/colores.constant";
import { tituloScreen } from "@/src/core/constants/titulo-screen.const";

export default function GpsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORES.HEADER_BACKGROUND_COLOR,
        },
        headerLargeTitle: true,
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: 'black'
      }}
    >
      <Stack.Screen
        name="mapa"
        options={{
          headerLeft: () => <BtnMenuDrewer />,
          title: "",
          headerLargeTitle: false,
        }}
      />
      <Stack.Screen
        name="entregar"
        options={{
          title: tituloScreen.visita.entregar,
        }}
      />
      <Stack.Screen
        name="novedad"
        options={{
          title: tituloScreen.visita.novedad,
        }}
      />
    </Stack>
  );
}
