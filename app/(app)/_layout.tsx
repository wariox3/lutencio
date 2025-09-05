import CustomDrawerContent from "@/src/shared/components/navegacion/custom-drawer-content";
import { Drawer } from "expo-router/drawer";
import "react-native-reanimated";

export default function AppLayout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerTitle: "",
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        }}
      />
      <Drawer.Screen
        name="(profile)"
        options={{
          headerShown: false,
          headerTitle: "",
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        }}
      />
      <Drawer.Screen
        name="(acercaDe)"
        options={{
          headerShown: false,
          headerTitle: "",
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        }}
      />
    </Drawer>
  );
}
