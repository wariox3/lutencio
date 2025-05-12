import { EntregaOpciones } from "@/components/ui/entrega/entregaOpciones";
import BtnMenuDrewer from "@/src/shared/components/btn-menu-drewer";
import { Stack } from "expo-router";

export default function VisitasLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        title: "",
        headerStyle: {
          backgroundColor: "#c5ecf8", // Azul con 70% de opacidad
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
