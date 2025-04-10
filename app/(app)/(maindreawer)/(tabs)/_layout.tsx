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
            case "(inicio)/index":
              return focused ? <Home size={size} color={'$blue10'} /> : <Home size={size} />;
            case "(gps)/index":
              return focused ? <MapPinned size={size} color={'$blue10'} /> : <MapPinned size={size} />;
          }
        },
      })}
    >
      <Tabs.Screen name="(inicio)/index" />
      <Tabs.Screen name="(gps)/index" />
    </Tabs>
  );
}
