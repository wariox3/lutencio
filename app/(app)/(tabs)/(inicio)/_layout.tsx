import COLORES from "@/src/core/constants/colores.constant";
import BtnMenuDrewer from "@/src/shared/components/navegacion/btn-menu-drewer";
import { Stack } from "expo-router";

export default function VisitasLayout() {
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
        name="inicio"
        options={{
          title: "",
          headerLeft: () => <BtnMenuDrewer />,
        }}
      />
    </Stack>
  );
}
