import SinElementos from "@/src/modules/visita/presentation/components/visita-lista/sin-elementos";
import { FlatList, Platform, RefreshControl } from "react-native";
import { YStack } from "tamagui";
import useVisitaNovedadLogViewModel from "../../application/view-model/use-vista-novedad-log.view-model";
import NovedadLogItem from "../components/novedad-log-item/novedad-log-item";
import MensajeFiltroSinResultados from "../components/visita-filtros/mensaje-filtro-sin-resultados";
import InputFiltros from "../components/visita-lista/input-filtros.screen";

export default function VisitaNovedadLogScreen() {
  const {
    arrVisitas,
    filtrosAplicados,
    obtenerColor,
    refreshing,
    recargarVisitas,
    theme,
    actualizarFiltros
  } = useVisitaNovedadLogViewModel();

  return (
    <>
      <YStack
        p={"$2"}
        height={50}
        bg={
          obtenerColor("HEADER_BACKGROUND_COLOR_LIGHT", "HEADER_BACKGROUND_COLOR_DARK")
        }
      >
        <InputFiltros onFilterChange={actualizarFiltros} />
      </YStack>
      <FlatList
        data={arrVisitas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <NovedadLogItem novedad={item}></NovedadLogItem>
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
            onRefresh={recargarVisitas}
            colors={[theme.blue10.val]} // Accede al valor HEX/RGB del color
            progressBackgroundColor={theme.blue5.val} // Opcional
            tintColor={theme.blue10.val} // Opcional (iOS)
          />
        }
      />
    </>
  );
}
