import CustomDrawerContent from "@/components/ui/dreawer/CustomDrawerContent";
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
    </Drawer>
  );
}
