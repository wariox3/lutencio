import { EntregaOpciones } from "@/src/modules/visita/presentation/components/opciones/opciones-sheet";
import COLORES from "@/src/core/constants/colores.constant";
import { tituloScreen } from "@/src/core/constants/titulo-screen.const";
import BtnMenuDrewer from "@/src/shared/components/navegacion/btn-menu-drewer";
import { Stack } from "expo-router";

export default function VisitasLayout() {
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
        name="lista"
        options={{
          title: "Visitas",
          headerLeft: () => <BtnMenuDrewer />,
          headerRight: () => <EntregaOpciones />,
        }}
      />
      <Stack.Screen
        name="cargar"
        options={{
          title: tituloScreen.visita.cargar,
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
      <Stack.Screen
        name="pendiente"
        options={{
          title: tituloScreen.visita.pendiente,
        }}
      />
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="modal-novedad-solucion"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
