import EntregaSinPermisoLocalizacion from "@/components/ui/entrega/entregaSinPermisoLocalizacion";
import EntregasSinElementos from "@/components/ui/entrega/entregasSinElementos";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import BtnAcciones from "@/src/shared/components/btn-acciones";
import React from "react";
import useVisitaListaViewModel from "../../application/view-model/use-visita-lista.view-model";
import ItemLista from "../components/visita-lista/item-lista";
import { FlatList, RefreshControl } from "react-native";

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

  if (permisoLocalizacion !== "granted")
    return <EntregaSinPermisoLocalizacion></EntregaSinPermisoLocalizacion>;

  return (
    <>
      <FlatList
        data={arrEntregas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <ItemLista visita={item} onPress={gestionEntrega}></ItemLista>
        )}
        style={{backgroundColor:"#ffff"}}
        ListHeaderComponent={
          <BtnAcciones
            visualizarCantidadSeleccionada={entregasSeleccionadas.length > 0}
            cantidadSeleccionada={entregasSeleccionadas.length}
            rutaEntregar={rutasApp.visitaEntregar}
            rutaNovedad={rutasApp.visitaNovedad}
          ></BtnAcciones>
        }
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={<EntregasSinElementos />}
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
