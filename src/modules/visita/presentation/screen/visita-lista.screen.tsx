import { rutasApp } from "@/src/core/constants/rutas.constant";
import SinElementos from "@/src/modules/visita/presentation/components/visita-lista/sin-elementos";
import { BotonAccion } from "@/src/shared/components/navegacion/btn-accion";
import { ArrowDownToLine, FileWarning } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { FlatList, Platform, RefreshControl } from "react-native";
import { XStack, YStack } from "tamagui";
import useVisitaListaViewModel from "../../application/view-model/use-visita-lista.view-model";
import MensajeFiltroSinResultados from "../components/visita-filtros/mensaje-filtro-sin-resultados";
import InputFiltros from "../components/visita-lista/input-filtros.screen";
import ItemLista from "../components/visita-lista/item-lista";
import React, { useCallback, useState, useEffect } from "react";

  /**
   * Pantalla que muestra una lista de visitas para entregar o reportar novedades.
   * Contiene un header con dos botones para acceder a las pantallas de entrega y
   * novedad respectivamente. Debajo del header se encuentra un input de búsqueda
   * para filtrar las visitas por guía o número de orden. La lista de visitas se
   * muestra en una FlatList con un componente personalizado para cada item, que
   * muestra la información de la visita y un botón para gestionar la entrega.
   * Si no hay visitas que coincidan con los filtros, se muestra un mensaje de "No
   * hay elementos que coincidan con los filtros".
   *
   * @returns Componente JSX de la pantalla de lista de visitas.
   */
export default function VisitaListaScreen() {
  const {
    entregasFiltradas,
    gestionEntrega,
    entregasSeleccionadas,
    actualizarFiltros,
    refreshing,
    theme,
    filtrosAplicados,
    obtenerColor,
  } = useVisitaListaViewModel();

  // Estado para la paginación virtual
  const [visibleItems, setVisibleItems] = useState<typeof entregasFiltradas>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20; // Cantidad de elementos por página

  // Actualizar los elementos visibles cuando cambian los filtros o la página actual
  useEffect(() => {
    const startIndex = 0;
    const endIndex = itemsPerPage * (currentPage + 1);
    setVisibleItems(entregasFiltradas.slice(startIndex, endIndex));
  }, [entregasFiltradas, currentPage]);

  // Función para cargar más elementos al hacer scroll
  const handleEndReached = useCallback(() => {
    // Verificar si hay más elementos para cargar
    if ((currentPage + 1) * itemsPerPage < entregasFiltradas.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [currentPage, entregasFiltradas.length, itemsPerPage]);

  // Optimización: Memoizar la función keyExtractor
  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

  // Optimización: Memoizar la función renderItem
  const renderItem = useCallback(({ item }: { item: any }) => (
    <MemoizedItemLista visita={item} onPress={gestionEntrega} />
  ), [gestionEntrega]);
  
  // Optimización: Implementar getItemLayout para evitar cálculos de dimensiones durante el renderizado
  // Esto mejora significativamente el rendimiento en listas grandes
  const getItemLayout = useCallback((data: any, index: number) => {
    const itemHeight = 150; // Altura aproximada de cada elemento en puntos
    return {
      length: itemHeight,
      offset: itemHeight * index,
      index,
    };
  }, []);

  // Optimización: Memoizar el componente ListEmptyComponent
  const ListEmptyComponent = useCallback(() => (
    <>
      {filtrosAplicados() ? (
        <MensajeFiltroSinResultados />
      ) : (
        <SinElementos />
      )}
    </>
  ), [filtrosAplicados]);

  const MemoizedItemLista = React.memo(ItemLista, (prevProps: any, nextProps: any) => {
    // Solo re-renderizar si cambia el estado de selección o los datos importantes
    return prevProps.visita.seleccionado === nextProps.visita.seleccionado &&
           prevProps.visita.id === nextProps.visita.id;
  });

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
        <InputFiltros onFilterChange={actualizarFiltros} placeholder="Buscar por número o documento" />
      </YStack>
      <FlatList
        data={visibleItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={5} // Reducir para mejorar el rendimiento
        windowSize={3} // Reducir para mejorar el rendimiento
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={100} // Aumentar para reducir la frecuencia de actualizaciones
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{
          paddingBottom: 50, // Ajusta este valor según el alto de tu tab bar
        }}
        style={{
          backgroundColor: obtenerColor("BLANCO", "NEGRO"),
          paddingTop: Platform.OS === "android" ? 30 : 25,
        }}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[theme.blue10.val]} // Accede al valor HEX/RGB del color
            progressBackgroundColor={theme.blue5.val} // Opcional
            tintColor={theme.blue10.val} // Opcional (iOS)
          />
        }
      />
    </>
  );
}
