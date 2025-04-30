import "react-native-reanimated";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/ui/dreawer/CustomDrawerContent";
import { Button } from "tamagui";
import { EntregaOpciones } from "@/components/ui/entrega/entregaOpciones";

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
          headerTitle: "",
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerRight: () => <EntregaOpciones />,
        }}
      />
    </Drawer>
  );
}
