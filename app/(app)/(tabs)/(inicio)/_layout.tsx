import BtnMenuDrewer from "@/src/shared/components/navegacion/btn-menu-drewer";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { Stack } from "expo-router";

export default function VisitasLayout() {
  const { obtenerColor } = useTemaVisual();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        title: undefined,
        headerStyle: {
          backgroundColor: obtenerColor(
            "HEADER_BACKGROUND_COLOR_LIGHT",
            "HEADER_BACKGROUND_COLOR_DARK"
          ),
        },
      }}
    >
      <Stack.Screen
        name="inicio"
        options={{
          title: "",
          headerLeft: () => <BtnMenuDrewer />,
        }}
      />
    </Stack>
  );
}
