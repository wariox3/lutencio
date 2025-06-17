import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { FileText, Home, MapPinned } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { obtenerColor } = useTemaVisual();
  
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: obtenerColor("BLANCO", "NEGRO"),
          borderTopWidth: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case "(inicio)":
              return focused ? (
                <Home size={size}  color={obtenerColor("AZUL_FUERTE", "BLANCO")} />
              ) : (
                <Home size={size} color={obtenerColor("GRIS_MEDIO", "GRIS_MEDIO")}/>
              );
            case "(visitas)":
              return focused ? (
                <FileText size={size}  color={obtenerColor("AZUL_FUERTE", "BLANCO")} />
              ) : (
                <FileText size={size}  color={obtenerColor("GRIS_MEDIO", "GRIS_MEDIO")} />
              );
              case "(gps)":
                return focused ? (
                  <MapPinned size={size} color={obtenerColor("AZUL_FUERTE", "BLANCO")}/>
                ) : (
                  <MapPinned size={size} color={obtenerColor("GRIS_MEDIO", "GRIS_MEDIO")} />
                );
          }
        },
      })}
    >
      <Tabs.Screen name="(inicio)" />
      <Tabs.Screen name="(visitas)"/>
      <Tabs.Screen name="(gps)"/>
    </Tabs>
  );
}
