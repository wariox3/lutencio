import "react-native-reanimated";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/ui/dreawer/CustomDrawerContent";

export default function Layout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
    <Drawer.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Home",
          title: "overview",
        }}
      />
      <Drawer.Screen
        name="entrega" // This is the name of the page and must match the url from root
        options={{
          headerTitle: "", // Oculta solo el título
          headerStyle: {
            elevation: 0, // Elimina la sombra en Android
            shadowOpacity: 0, // Elimina la sombra en iOS
            borderBottomWidth: 0, // Elimina el borde inferior
          },
        }}
      />
      <Drawer.Screen
        name="entregaCargar" // This is the name of the page and must match the url from root
        options={{
          headerTitle: "", // Oculta solo el título
          headerStyle: {
            elevation: 0, // Elimina la sombra en Android
            shadowOpacity: 0, // Elimina la sombra en iOS
            borderBottomWidth: 0, // Elimina el borde inferior
          },
        }}
      />
    </Drawer>
  );
}
