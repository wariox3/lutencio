import { useAppDispatch } from "@/src/application/store/hooks";
import { menuItems } from "@/src/core/constants/menuItems.constant";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import storageService from "@/src/core/services/storage.service";
import { cerrarSesion } from "@/src/modules/auth/application/slices/auth.slice";
import {
  limpiarEntregaSeleccionada,
  quitarEntregas,
} from "@/src/modules/visita/application/slice/entrega.slice";
import { detenerTareaSeguimientoUbicacion } from "@/utils/services/locationService";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { LogOut } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Avatar, ListItem, XStack, YGroup } from "tamagui";
import { useAlertaGlobal } from "../../hooks/useAlertaGlobal";
import { useTemaVisual } from "../../hooks/useTemaVisual";
import COLORES from "@/src/core/constants/colores.constant";
import { cambiarEstadoModoPrueba } from "@/src/application/slices/configuracion.slice";

export default function CustomDrawerContent(props: any) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { abrirAlerta } = useAlertaGlobal();
  const { obtenerColor } = useTemaVisual();

  const cerrarSession = () => {
    return abrirAlerta({
      titulo: "Cerrar sesión",
      mensaje: "Esta seguro de cerrar la sesión",
      onAceptar: async () => {
        await storageService.clear();
        await detenerTareaSeguimientoUbicacion();
        dispatch(limpiarEntregaSeleccionada());
        dispatch(quitarEntregas());
        dispatch(cambiarEstadoModoPrueba({ nuevoEstado: false }));
        dispatch(cerrarSesion());
        router.replace(rutasApp.login);
      },
    });
  };

  const navegar = (ruta: any) => {
    router.push(ruta);
  };

  const miAvatar = require("@/assets/images/usuario.jpeg");

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: obtenerColor("BLANCO", "NEGRO") }}>
      <XStack justify={"center"}>
        <Avatar circular size="$8">
          <Avatar.Image src={miAvatar} />
          <Avatar.Fallback bg={COLORES.AZUL_FUERTE} />
        </Avatar>
      </XStack>

      <XStack $sm={{ flexDirection: "column" }}>
        <YGroup width={300} size="$4">
          {Object.keys(menuItems).map((name: any, index: number) =>
            CutomDrawerContentItem(index, name)
          )}

          <YGroup width={300} size="$4">
            <YGroup.Item>
              <ListItem
                icon={LogOut}
                title={"Salir"}
                onPress={() => cerrarSession()}
                mt={"$2"}
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
          icon={IconComponent}
          title={name}
          onPress={() => navegar(item.ruta)}
          mt={"$2"}
        />
      </YGroup.Item>
    );
  }
}
