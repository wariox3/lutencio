import { rutasApp } from "@/src/core/constants/rutas.constant";
import SinElementos from "@/src/modules/visita/presentation/components/visita-lista/sin-elementos";
import SinPermisoLocalizacion from "@/src/modules/visita/presentation/components/visita-lista/sin-permiso-localizacion";
import { BotonAccion } from "@/src/shared/components/navegacion/btn-accion";
import {
  AlertCircle,
  ArrowDownToLine,
  Bell,
  FileWarning,
  Package,
  Truck,
} from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import useVisitaListaViewModel from "../../application/view-model/use-visita-lista.view-model";
import ItemLista from "../components/visita-lista/item-lista";
import COLORES from "@/src/core/constants/colores.constant";

export default function VisitaListaScreen() {
  const {
    arrEntregas,
    gestionEntrega,
    permisoLocalizacion,
    entregasSeleccionadas,
    refreshing,
    setRefreshing,
    recargarOrdenEntrega,
    theme,
  } = useVisitaListaViewModel();

  if (permisoLocalizacion !== "granted") return <SinPermisoLocalizacion />;

  return (
    <>
      <XStack
        justify={"space-around"}
        mx="$2"
        py={"$2"}
        style={{ backgroundColor: "#ffff" }}
      >
        <BotonAccion
          onPress={() => router.navigate(rutasApp.visitaEntregar)}
          icon={<ArrowDownToLine size="$2" />}
          texto="Entregar"
          themeColor="blue"
          mostrarCantidad={entregasSeleccionadas.length > 0}
          cantidad={entregasSeleccionadas.length}
        />
        <BotonAccion
          onPress={() => router.navigate(rutasApp.visitaNovedad)}
          icon={<FileWarning size="$2" />}
          texto="Novedad"
          themeColor="yellow"
          mostrarCantidad={entregasSeleccionadas.length > 0}
          cantidad={entregasSeleccionadas.length}
        />
      </XStack>
      <FlatList
        data={arrEntregas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <ItemLista visita={item} onPress={gestionEntrega}></ItemLista>
        )}
        style={{ backgroundColor: "#ffff" }}
        ListEmptyComponent={<SinElementos />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={recargarOrdenEntrega}
            colors={[theme.blue10.val]} // Accede al valor HEX/RGB del color
            progressBackgroundColor={theme.blue5.val} // Opcional
            tintColor={theme.blue10.val} // Opcional (iOS)
          />
        }
      />
    </>
  );
}
