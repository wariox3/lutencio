import { tituloScreen } from "@/src/core/constants/titulo-screen.const";
import { EntregaOpciones } from "@/src/modules/visita/presentation/components/opciones/opciones-sheet";
import BtnMenuDrewer from "@/src/shared/components/navegacion/btn-menu-drewer";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { Stack } from "expo-router";

export default function VisitasLayout() {
  const { obtenerColor } = useTemaVisual();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: obtenerColor(
            "HEADER_BACKGROUND_COLOR_LIGHT",
            "HEADER_BACKGROUND_COLOR_DARK"
          ),
        },
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: obtenerColor("NEGRO", "BLANCO"),
      }}
    >
      <Stack.Screen
        name="lista"
        options={{
          title: "Visitas",
          headerLeft: () => <BtnMenuDrewer />,
          headerRight: () => <EntregaOpciones />,
          headerShadowVisible: false, // applied here
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
      <Stack.Screen
        name="log"
        options={{
          title: tituloScreen.visita.log,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="log-novedades"
        options={{
          title: 'Log Novedades',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: tituloScreen.visita.visita,
        }}
      />
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
