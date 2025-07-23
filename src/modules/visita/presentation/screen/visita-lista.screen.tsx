import { rutasApp } from "@/src/core/constants/rutas.constant";
import SinElementos from "@/src/modules/visita/presentation/components/visita-lista/sin-elementos";
import { ArrowDownToLine, FileWarning } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Platform, RefreshControl } from "react-native";
import { View, XStack, YStack } from "tamagui";
import useVisitaListaViewModel from "../../application/view-model/use-visita-lista.view-model";
import MensajeFiltroSinResultados from "../components/visita-filtros/mensaje-filtro-sin-resultados";
import InputFiltros from "../components/visita-lista/input-filtros.screen";
import ItemLista from "../components/visita-lista/item-lista";
import SinPermisos from "@/src/shared/components/comun/sin-permisos";
import { BotonAccion } from "@/src/shared/components/navegacion/btn-accion";

export default function VisitaListaScreen() {
  const {
    arrEntregas,
    gestionEntrega,
    tienePermisos,
    entregasSeleccionadas,
    refreshing,
    recargarOrdenEntrega,
    theme,
    filtrosAplicados,
    obtenerColor,
  } = useVisitaListaViewModel();

  if (!tienePermisos) return (
    <View flex={1} bg={
      obtenerColor("BLANCO", "NEGRO")
    }>
      <SinPermisos />
    </View>
  );

  return (
    <>
      <YStack
        p={"$2"}
        height={100}
        bg={
          obtenerColor("HEADER_BACKGROUND_COLOR_LIGHT", "HEADER_BACKGROUND_COLOR_DARK")
        }
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
        contentContainerStyle={{
          paddingBottom: 50, // Ajusta este valor según el alto de tu tab bar
        }}
        style={{
          backgroundColor: obtenerColor("BLANCO", "NEGRO"),
          paddingTop: Platform.OS === "android" ? 30 : 25,
        }}
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
