import { Tabs } from "expo-router";
import { FileText, Home, MapPinned } from "@tamagui/lucide-icons";
import BtnMenuDrewer from "@/src/shared/components/btn-menu-drewer";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case "(inicio)":
              return focused ? (
                <Home size={size} color={"$blue10"} />
              ) : (
                <Home size={size} />
              );
            case "(visitas)":
              return focused ? (
                <FileText size={size} color={"$blue10"} />
              ) : (
                <FileText size={size} />
              );
              case "(gps)":
                return focused ? (
                  <MapPinned size={size} color={"$blue10"} />
                ) : (
                  <MapPinned size={size} />
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
