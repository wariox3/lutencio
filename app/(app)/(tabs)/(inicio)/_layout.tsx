import { EntregaOpciones } from "@/components/ui/entrega/entregaOpciones";
import COLORES from "@/src/core/constants/colores";
import BtnMenuDrewer from "@/src/shared/components/btn-menu-drewer";
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
