import SinPermisoLocalizacion from "@/src/modules/visita/presentation/components/visita-lista/sin-permiso-localizacion";
import SinElementos from "@/src/modules/visita/presentation/components/visita-lista/sin-elementos";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import React from "react";
import useVisitaListaViewModel from "../../application/view-model/use-visita-lista.view-model";
import ItemLista from "../components/visita-lista/item-lista";
import { FlatList, RefreshControl } from "react-native";
import { router } from "expo-router";
import { ArrowDownToLine, FileWarning } from "@tamagui/lucide-icons";
import { BotonAccion } from "@/src/shared/components/navegacion/btn-accion";
import { XStack } from "tamagui";

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
      <FlatList
        data={arrEntregas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <ItemLista visita={item} onPress={gestionEntrega}></ItemLista>
        )}
        style={{ backgroundColor: "#ffff" }}
        ListHeaderComponent={
          <XStack justify={"space-around"} mx="$2" mt={"$2"}>
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
        }
        contentInsetAdjustmentBehavior="automatic"
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
