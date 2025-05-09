import { Stack } from "expo-router";
import BtnMenuDrewer from "@/src/shared/components/btn-menu-drewer";

export default function GpsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        title: "",
        headerStyle: {
          backgroundColor: "#c7eef8", // Azul con 70% de opacidad
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
