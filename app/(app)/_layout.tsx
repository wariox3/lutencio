import "react-native-reanimated";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/ui/dreawer/CustomDrawerContent";
import { Button, Text, View } from "tamagui";
import { EntregaOpciones } from "@/components/ui/entrega/entregaOpciones";
import ReusableSheet from "@/src/shared/components/modal-sheet";
import { MoreVertical } from "@tamagui/lucide-icons";

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
