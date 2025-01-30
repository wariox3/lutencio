import "react-native-reanimated";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/ui/dreawer/CustomDrawerContent";
export default function AppLayout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Home",
          title: "overview",
        }}
      />
    </Drawer>
  );
}
