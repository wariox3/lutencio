import { Tabs } from "expo-router";
import { Home, MapPinned } from "@tamagui/lucide-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case "inicio":
              return focused ? <Home size={size} color={'$blue10'} /> : <Home size={size} />;
            case "gps":
              return focused ? <MapPinned size={size} color={'$blue10'} /> : <MapPinned size={size} />;
          }
        },
      })}
    >
      <Tabs.Screen name="inicio" />
      <Tabs.Screen name="gps" />
    </Tabs>
  );
}
