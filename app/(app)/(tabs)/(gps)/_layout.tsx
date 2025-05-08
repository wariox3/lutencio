import { Stack } from "expo-router";
import BtnMenuDrewer from "@/src/shared/components/btn-menu-drewer";

export default function GpsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "",
        headerShadowVisible: false,
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
