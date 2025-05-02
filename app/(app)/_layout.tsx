import CustomDrawerContent from "@/components/ui/dreawer/CustomDrawerContent";
import BtnMenuDrewer from "@/src/shared/components/btn-menu-drewer";
import { Drawer } from "expo-router/drawer";
import "react-native-reanimated";

export default function AppLayout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: "",
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerLeft: () => <BtnMenuDrewer />,
        }}
      />
      <Drawer.Screen
        name="(visitas)"
        options={{
          headerShown: false,
        }}
      />
    </Drawer>
  );
}
