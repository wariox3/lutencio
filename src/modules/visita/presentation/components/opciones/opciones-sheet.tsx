import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { alertas } from "@/src/core/constants/alertas.const";
import COLORES from "@/src/core/constants/colores.constant";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import {
  selectCantidadNovedades,
  selectSincronizandoNovedades,
} from "@/src/modules/novedad/application/store/novedad.selector";
import {
  getSincronizandoEntregas,
  selectEntregasSincronizadas
} from "@/src/modules/visita/application/slice/entrega.selector";
import {
  cambiarEstadoSeleccionado,
  limpiarEntregaSeleccionada,
} from "@/src/modules/visita/application/slice/entrega.slice";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import { useEliminarEnGaleria } from "@/src/shared/hooks/useMediaLibrary";
import {
  FileCheck,
  FileQuestion,
  FileUp,
  FileWarning,
  FileX,
  Loader2,
  Logs,
  MoreVertical,
  Package,
  XCircle,
} from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import { useRouter } from "expo-router";
import { memo, useEffect, useRef, useState } from "react";
import { Animated, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { shallowEqual } from "react-redux";
import {
  Button,
  H4,
  H6,
  ListItem,
  Spinner,
  Text,
  View,
  XStack,
  YGroup,
} from "tamagui";
import CardDesvincularOrdenEntrega from "./card-desvincular-orden-entrega";
import CardInformativa from "./card-informativa";

const spModes = ["percent", "constant", "fit", "mixed"] as const;

export const EntregaOpciones = () => {
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [modal] = useState(true);
  const [snapPointsMode] = useState<(typeof spModes)[number]>("mixed");
  const snapPoints = ["100%"];
  const entregas = useAppSelector(({ entregas }) => entregas.entregas || []);
  const cantidadNovedades = useAppSelector(selectCantidadNovedades);
  const arrEntregasSinconizado = useAppSelector(selectEntregasSincronizadas);
  const sincronizandoEntregas = useAppSelector(getSincronizandoEntregas);
  const sincronizandoLoader = useAppSelector(selectSincronizandoNovedades);

  // Add this inside the EntregaOpciones component
  const spinValue = useRef(new Animated.Value(0)).current;

  // Set up the animation when sincronizandoEntregas changes
  useEffect(() => {
    if (sincronizandoEntregas || sincronizandoLoader) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Stop the animation when not syncing
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
  }, [sincronizandoEntregas, sincronizandoLoader]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      <XStack justify={"flex-end"} items="center" gap="$2">
        {sincronizandoEntregas ||
          (sincronizandoLoader && (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Loader2 size={12} fontWeight={"bold"} />
            </Animated.View>
          ))}
        <XStack gap="$2">
          <XStack items="center" gap="$1">
            <Package size={12} color="$blue10" />
            <Text fontSize="$2" fontWeight="600" color="$blue10">
              {entregas.length}
            </Text>
          </XStack>
          <XStack items="center" gap="$1">
            <FileWarning size={12} color="orange" />
            <Text fontSize="$2" fontWeight="600" color="orange">
              {cantidadNovedades}
            </Text>
          </XStack>
        </XStack>
        <XStack gap="$2">
          <XStack items="center" gap="$1">
            <FileCheck size={12} color="$green10" />
            <Text fontSize="$2" fontWeight="600" color="$green10">
              {arrEntregasSinconizado.length}
            </Text>
          </XStack>
        </XStack>
      </XStack>

      <Button
        icon={<MoreVertical size={"$3"} />}
        onPress={() => setOpen(true)}
        mx={"$2"}
        unstyled
      ></Button>

      <Sheet
        forceRemoveScrollEnabled={open}
        modal={modal}
        open={open}
        onOpenChange={setOpen}
        snapPoints={snapPoints}
        snapPointsMode={snapPointsMode}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          background="#4cafe3"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Frame p="$4" gap="$5">
          <SheetContents {...{ setOpen }} />
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

// in general good to memoize the contents to avoid expensive renders during animations
const SheetContents = memo(({ setOpen }: any) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const entregasSeleccionadas = useAppSelector(
    ({ entregas }) => entregas.entregasSeleccionadas || []
  );
  const entregas = useAppSelector(({ entregas }) => entregas.entregas || []);
  const arrEntregas = useAppSelector(
    ({ entregas }) =>
      entregas.entregas.filter((entrega) => !entrega.estado_entregado) || [],
    shallowEqual
  );

  const arrEntregasPendientes = useAppSelector(
    ({ entregas }) =>
      entregas.entregas.filter(
        (entrega) =>
          entrega.estado_entregado === true &&
          entrega.estado_sincronizado === false &&
          entrega.estado_error === false
      ) || [],
    shallowEqual
  );

  const arrEntregasConErrores = useAppSelector(
    ({ entregas }) =>
      entregas.entregas.filter((entrega) => entrega.estado_error === true) ||
      [],
    shallowEqual
  );

  const cantidadNovedades = useAppSelector(selectCantidadNovedades);
  const arrEntregasSinconizado = useAppSelector(selectEntregasSincronizadas);

  const { eliminarArchivo } = useEliminarEnGaleria();
  const [loadSincronizando, setLoadSincronizando] = useState(false);
  const [loadSincronizandoNovedad, setLoadSincronizandoNovedad] =
    useState(false);

  const navegarEntregaPendietes = () => {
    router.navigate(rutasApp.vistaPendiente);
    setOpen(false);
  };

  const retirarSeleccionadas = () => {
    entregasSeleccionadas.map((entrega: number) => {
      dispatch(cambiarEstadoSeleccionado(entrega));
    });
    dispatch(limpiarEntregaSeleccionada());
    setOpen(false);
  };

  const navegarLog = () => {
    router.navigate(rutasApp.vistaLog);
    setOpen(false);
  };

  const navegarLogNovedades = () => {
    router.navigate(rutasApp.vistaLogNovedades);
    setOpen(false);
  };

  const confirmarSincornizarEntregas = async () => {
    setOpen(false);
    mostrarAlertHook({
      titulo: alertas.titulo.advertencia,
      mensaje: alertas.mensaje.accionIrreversible,
      onAceptar: () => gestionGuias(),
    });
  };

  const gestionGuias = async () => {};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <XStack justify="space-between">
        <H4 mb="$2">Opciones</H4>
        <Button
          size="$4"
          circular
          icon={<XCircle size="$3" color={"$red10"} />}
          onPress={() => setOpen(false)}
          theme={"red"}
        />
      </XStack>
      <YGroup width={"auto"} flex={1} size="$4" gap="$4" overflow="hidden">
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <H6>Orden de entrega</H6>
          <YGroup.Item>
            <XStack gap="$2">
              <CardInformativa
                backgroundColor={COLORES.AZUL_SUAVE}
                titulo="Cargadas"
                cantidad={arrEntregas.length}
                icono={<Package size={28} opacity={0.7} />}
              ></CardInformativa>
              <CardInformativa
                backgroundColor={COLORES.NARANJA_SUAVE}
                titulo="Novedades"
                cantidad={cantidadNovedades}
                icono={<FileWarning size={28} opacity={0.7} />}
              ></CardInformativa>
              <CardInformativa
                backgroundColor={COLORES.VERDE_SUAVE}
                titulo="Entregas"
                cantidad={arrEntregasSinconizado.length}
                icono={<FileCheck size={28} opacity={0.7} />}
              ></CardInformativa>
            </XStack>

            {entregas.length > 0 ? (
              <View my="$2">
                <CardDesvincularOrdenEntrega close={() => setOpen(false)} />
              </View>
            ) : null}

            {entregasSeleccionadas.length > 0 ? (
              <>
                <H6 mb="$2">Seleccionadas</H6>
                <ListItem
                  hoverTheme
                  icon={<FileX size="$2" />}
                  title="Retirar seleccionados"
                  subTitle="Retirar todos los elementos seleccionados"
                  onPress={() => retirarSeleccionadas()}
                />
              </>
            ) : null}

            {arrEntregasPendientes.length > 0 ||
            arrEntregasConErrores.length > 0 ||
            cantidadNovedades > 0 ? (
              <>
                <H6 mb="$2">Sincronizar</H6>
                <>
                  {arrEntregasPendientes.length > 0 ? (
                    <>
                      <ListItem
                        hoverTheme
                        icon={<FileUp size="$2" />}
                        iconAfter={
                          <>
                            {loadSincronizando ? (
                              <Spinner size="small" color="$green10" />
                            ) : null}
                          </>
                        }
                        title="Sincronizar"
                        subTitle="Entregas pendientes por entregar"
                        onPress={() => confirmarSincornizarEntregas()}
                      />

                      <ListItem
                        hoverTheme
                        icon={<FileQuestion size="$2" />}
                        title="Pendientes"
                        subTitle={
                          "Cantidad pendientes por sincronizar: " +
                          arrEntregasPendientes.length
                        }
                        onPress={() => navegarEntregaPendietes()}
                      />
                    </>
                  ) : null}
                </>
                <>
                  {arrEntregasConErrores.length > 0 ? (
                    <ListItem
                      hoverTheme
                      icon={<FileQuestion size="$2" />}
                      title="Errores"
                      subTitle={
                        "Cantidad con errores: " + arrEntregasConErrores.length
                      }
                      onPress={() => navegarEntregaPendietes()}
                    />
                  ) : null}
                </>
                <>
                  {cantidadNovedades > 0 ? (
                    <ListItem
                      hoverTheme
                      icon={<FileWarning size="$2" />}
                      iconAfter={
                        <>
                          {loadSincronizandoNovedad ? (
                            <Spinner size="small" color="$green10" />
                          ) : null}
                        </>
                      }
                      title="Novedades"
                      subTitle={"Cantidad con novedades: " + cantidadNovedades}
                      onPress={() => navegarEntregaPendietes()}
                    />
                  ) : null}
                </>
              </>
            ) : null}

            <H6 mb="$2">Log</H6>
            <View my="$2">
              <ListItem
                hoverTheme
                icon={<Logs size="$2" />}
                title="Log visitas"
                subTitle="Registro de acciones realizadas sobre las visitas"
                onPress={() => navegarLog()}
              />
            </View>
            <View my="$2">
              <ListItem
                hoverTheme
                icon={<Logs size="$2" />}
                title="Log novedades"
                subTitle="Registro de acciones realizadas sobre las novedades"
                onPress={() => navegarLogNovedades()}
              />
            </View>
          </YGroup.Item>
        </ScrollView>
      </YGroup>
    </SafeAreaView>
  );
});
