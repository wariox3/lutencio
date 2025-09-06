import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import COLORES from "@/src/core/constants/colores.constant";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import {
  selectCantidadNovedades,
  selectCantidadNovedadesConErrorTemporal,
  selectNovedadesConErrorTemporal,
  selectSincronizandoNovedades,
} from "@/src/modules/novedad/application/store/novedad.selector";
import {
  changeEstadoSincronizadoError,
  finishedSavingProcessNovedades,
} from "@/src/modules/novedad/application/store/novedad.slice";
import {
  getSincronizandoEntregas,
  selectCantidadVisitasConErrorTemporal,
  selectCantidadVisitasTotal,
  selectEntregadas,
  selectTotalEntregasCounter,
  selectVisitasConErrorTemporal,
} from "@/src/modules/visita/application/slice/entrega.selector";
import {
  cambiarEstadoSeleccionado,
  cambiarEstadoSincronizadoError,
  entregasProcesadas,
  limpiarEntregaSeleccionada,
} from "@/src/modules/visita/application/slice/entrega.slice";
import {
  mostrarAlertHook,
  useAlertaGlobal,
} from "@/src/shared/hooks/useAlertaGlobal";
import { useEliminarEnGaleria } from "@/src/shared/hooks/useMediaLibrary";
import useNetworkStatus from "@/src/shared/hooks/useNetworkStatus";
import {
  ClipboardX,
  CloudUpload,
  FileCheck,
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
  const cantidadNovedades = useAppSelector(selectCantidadNovedades);
  const entregadas = useAppSelector(selectEntregadas);
  const totalEntregas = useAppSelector(selectTotalEntregasCounter);
  const sincronizandoEntregas = useAppSelector(getSincronizandoEntregas);
  const sincronizandoLoader = useAppSelector(selectSincronizandoNovedades);
  const cantidadVisitasTotal = useAppSelector(selectCantidadVisitasTotal);

  const cantidadEntregasErrorTemporal = useAppSelector(
    selectCantidadVisitasConErrorTemporal
  );
  const cantidadNovedadesErrorTemporal = useAppSelector(
    selectCantidadNovedadesConErrorTemporal
  );

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
          {cantidadEntregasErrorTemporal + cantidadNovedadesErrorTemporal >
            0 && (
            <XStack items="center" gap="$1">
              <CloudUpload size={12} color="$red10" />
              <Text fontSize="$2" fontWeight="600" color="$red10">
                {cantidadEntregasErrorTemporal + cantidadNovedadesErrorTemporal}
              </Text>
            </XStack>
          )}
          <XStack items="center" gap="$1">
            <Package size={12} color="$blue10" />
            <Text fontSize="$2" fontWeight="600" color="$blue10">
              {cantidadNovedades+entregadas.length} de {cantidadVisitasTotal}
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
              {entregadas.length}
            </Text>
          </XStack>
        </XStack>
      </XStack>

      <Button
        icon={<MoreVertical size={"$2"} />}
        onPressIn={() => setOpen(true)}
        ml={"$2"}
        paddingBlock={"$2"}
        paddingInline={"$2"}
        borderEndStartRadius={"$10"}
        borderEndEndRadius={"$10"}
        borderStartEndRadius={"$10"}
        borderStartStartRadius={"$10"}
        style={{
          backgroundColor: "transparent",
          borderColor: "transparent",
        }}
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
  const { cancel } = useAlertaGlobal();
  const isOnline = useNetworkStatus();
  const dispatch = useAppDispatch();
  const entregasSeleccionadas = useAppSelector(
    ({ entregas }) => entregas.entregasSeleccionadas || []
  );
  const entregas = useAppSelector(({ entregas }) => entregas.entregas || []);
  const totalEntregas = useAppSelector(selectTotalEntregasCounter);

  const cargandoEntregas = useAppSelector(getSincronizandoEntregas);
  const cargandoNovedades = useAppSelector(selectSincronizandoNovedades);
  const cantidadNovedadesErrorTemporal = useAppSelector(
    selectCantidadNovedadesConErrorTemporal
  );
  const novedadesErrorTemporal = useAppSelector(
    selectNovedadesConErrorTemporal
  );
  const cantidadVisitasErrorTemporal = useAppSelector(
    selectCantidadVisitasConErrorTemporal
  );
  const visitasErrorTemporal = useAppSelector(selectVisitasConErrorTemporal);

  const cantidadNovedades = useAppSelector(selectCantidadNovedades);
  const entregadas = useAppSelector(selectEntregadas);
  const cantidadVisitasTotal = useAppSelector(selectCantidadVisitasTotal);

  const { eliminarArchivo } = useEliminarEnGaleria();
  const [loadSincronizando, setLoadSincronizando] = useState(false);

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

  const sincronizarPendientes = async () => {
    if (!isOnline) {
      mostrarAlertHook({
        titulo: "Error",
        mensaje: "No hay conexión a internet",
        onAceptar: () => {},
      });
      setOpen(false);

      return;
    }

    cancel();
    sincronizarVisitasPendientes();
    sincronizarNovedadesPedientes();
    setOpen(false);
  };

  const sincronizarNovedadesPedientes = async () => {
    if (novedadesErrorTemporal?.length === 0) return;

    const novedadesIds: number[] = [];
    novedadesErrorTemporal?.forEach((novedad) => {
      novedadesIds.push(Number(novedad.id));
      dispatch(
        changeEstadoSincronizadoError({
          id: novedad.id,
          nuevoEstado: false,
          codigo: 0,
          mensaje: "",
        })
      );
    });
    dispatch(finishedSavingProcessNovedades({ novedadesIds }));
  };

  const sincronizarVisitasPendientes = async () => {
    if (visitasErrorTemporal?.length === 0) return;

    const visitasIds: number[] = [];
    visitasErrorTemporal?.forEach((visita) => {
      visitasIds.push(visita.id);
      dispatch(
        cambiarEstadoSincronizadoError({
          visitaId: visita.id,
          nuevoEstado: false,
          codigo: 0,
          mensaje: "",
        })
      );
    });

    dispatch(entregasProcesadas({ entregasIds: visitasIds }));
  };

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
                cantidad={`${
                  cantidadNovedades + entregadas.length
                } de ${cantidadVisitasTotal}`}
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
                cantidad={entregadas.length}
                icono={<FileCheck size={28} opacity={0.7} />}
              ></CardInformativa>
            </XStack>

            {entregas.length > 0 ? (
              <View my="$2">
                <CardDesvincularOrdenEntrega
                  close={() => setOpen(false)}
                  titulo="Desvincular"
                  mensaje="Retirar la orden de entrega actual y visitas"
                  textoColor="VERDE_FUERTE"
                  bgColor="VERDE_SUAVE"
                  validaEntregasPendentesSincronizar={true}
                />
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

            <H6 mb="$2">Sincronizar</H6>
            <ListItem
              hoverTheme
              icon={<CloudUpload size="$2" />}
              iconAfter={
                <>
                  {cargandoEntregas || cargandoNovedades ? (
                    <Spinner size="small" color="$green10" />
                  ) : null}
                </>
              }
              title="Sincronizar"
              subTitle="Sincronizar visitas/novedades pendientes"
              onPress={sincronizarPendientes}
              disabled={cargandoEntregas || cargandoNovedades}
              opacity={cargandoEntregas || cargandoNovedades ? 0.5 : 1}
            />

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
          {entregas.length > 0 ? (
            <View my="$2">
              <CardDesvincularOrdenEntrega
                close={() => setOpen(false)}
                titulo="Forzar desvincular"
                mensaje="Esto eliminará todos los registros guardados en tu dispositivo."
                textoColor="ROJO_FUERTE"
                bgColor="ROJO_SUAVE"
                validaEntregasPendentesSincronizar={false}
              />
            </View>
          ) : null}
        </ScrollView>
      </YGroup>
    </SafeAreaView>
  );
});
