import { menuItems } from "@/constants/menuItems";
import { rutasApp } from "@/constants/rutas";
import { useAppDispatch } from "@/src/application/store/hooks";
import { cerrarSesion } from "@/src/modules/auth/application/slices/auth.slice";
import { limpiarEntregaSeleccionada, quitarEntregas } from "@/src/modules/visita/application/slice/entrega.slice";
import { detenerTareaSeguimientoUbicacion } from "@/utils/services/locationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { LogOut } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";
import { ListItem, XStack, YGroup } from "tamagui";

export default function CustomDrawerContent(props: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cerrarSession = () => {
    return Alert.alert(
      "Cerrar sesión",
      "Esta seguro de cerrar la sesión",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            await AsyncStorage.removeItem("jwtToken");
            await AsyncStorage.removeItem("usuario_id");
            await AsyncStorage.removeItem("despacho");
            await AsyncStorage.removeItem("subdominio");
            await detenerTareaSeguimientoUbicacion();
            dispatch(limpiarEntregaSeleccionada());
            dispatch(quitarEntregas());
            dispatch(cerrarSesion());
            router.replace(rutasApp.login);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const navegar = (ruta: any) => {
    router.push(ruta);
  };

  return (
    <DrawerContentScrollView {...props}>
      <XStack $sm={{ flexDirection: "column" }}>
        <YGroup width={300} size="$4">
          {Object.keys(menuItems).map((name: any, index: number) =>
            CutomDrawerContentItem(index, name)
          )}

          <YGroup width={300} size="$4">
            <YGroup.Item>
              <ListItem
                hoverTheme
                pressTheme
                style={{ backgroundColor: "white" }}
                icon={LogOut}
                title={"Salir"}
                onPress={() => cerrarSession()}
              />
            </YGroup.Item>
          </YGroup>
        </YGroup>
      </XStack>
      <XStack $sm={{ flexDirection: "column" }}></XStack>
    </DrawerContentScrollView>
  );

  function CutomDrawerContentItem(index: number, name: string) {
    const item = menuItems[name] || menuItems.home; // Usa home si no encuentra el nombre
    const IconComponent = item.icon;

    return (
      <YGroup.Item key={index.toString()}>
        <ListItem
          hoverTheme
          pressTheme
          style={{ backgroundColor: "white" }}
          icon={IconComponent}
          title={name}
          onPress={() => navegar(item.ruta)}
        />
      </YGroup.Item>
    );
  }
}
