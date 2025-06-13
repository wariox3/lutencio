import COLORES from "@/src/core/constants/colores.constant";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import SinElementos from "@/src/modules/visita/presentation/components/visita-lista/sin-elementos";
import SinPermisoLocalizacion from "@/src/modules/visita/presentation/components/visita-lista/sin-permiso-localizacion";
import ReusableSheet from "@/src/shared/components/comun/modal-sheet";
import { BotonAccion } from "@/src/shared/components/navegacion/btn-accion";
import {
  ArrowDownToLine,
  FileWarning,
  Filter,
  ScanQrCode,
  Search,
  Share,
} from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { Input, XStack, YStack } from "tamagui";
import useVisitaListaViewModel from "../../application/view-model/use-visita-lista.view-model";
import MensajeFiltroAplicado from "../components/visita-filtros/mensaje-filtro-aplicado";
import MensajeFiltroSinResultados from "../components/visita-filtros/mensaje-filtro-sin-resultados";
import ItemLista from "../components/visita-lista/item-lista";
import FormularioFiltros from "../components/visita-lista/input-filtros.screen";
import InputFiltros from "../components/visita-lista/input-filtros.screen";

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
    filtrosAplicados,
  } = useVisitaListaViewModel();

  if (permisoLocalizacion !== "granted") return <SinPermisoLocalizacion />;

  return (
    <>
      <YStack
        p={"$2"}
        style={{
          backgroundColor: COLORES.HEADER_BACKGROUND_COLOR,
          height: 100,
        }}
      >
        <XStack justify={"space-around"}>
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
        <InputFiltros />
      </YStack>
      <FlatList
        data={arrEntregas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <ItemLista visita={item} onPress={gestionEntrega}></ItemLista>
        )}
        style={{ backgroundColor: "#ffff", paddingTop: 25 }}
        ListEmptyComponent={
          <>
            {filtrosAplicados ? (
              <MensajeFiltroSinResultados />
            ) : (
              <SinElementos />
            )}
          </>
        }
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
