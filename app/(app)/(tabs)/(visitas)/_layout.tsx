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
        name="lista"
        options={{
          title: "",
          headerLeft: () => <BtnMenuDrewer />,
          headerRight: () => <EntregaOpciones />,
        }}
      />
      <Stack.Screen name="cargar" />
      <Stack.Screen name="novedad" />
      <Stack.Screen name="pendiente" />
    </Stack>
  );
}
