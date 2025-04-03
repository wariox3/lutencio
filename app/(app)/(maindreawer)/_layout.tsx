import "react-native-reanimated";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/ui/dreawer/CustomDrawerContent";

export default function Layout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="index"
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
        name="entrega"
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
        name="entregaCargar"
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
        name="entregaFormulario"
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
        name="entregaPendientes"
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
        name="entregaPendientesDetalle"
        options={({ route }) => ({
          drawerLabel: route.params?.entregaId
            ? undefined
            : "Detalle de Entrega",
          drawerItemStyle: route.params?.entregaId ? { display: "none" } : {},
          headerTitle: "",
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        })}
      />
    </Drawer>
  );
}
