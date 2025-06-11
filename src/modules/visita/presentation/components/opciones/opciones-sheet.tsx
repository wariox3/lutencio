import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { alertas } from "@/src/core/constants/alertas.const";
import COLORES from "@/src/core/constants/colores.constant";
import APIS from "@/src/core/constants/endpoint.constant";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import {
  selectEntregasConNovedad,
  selectEntregasSincronizadas,
} from "@/src/modules/visita/application/slice/entrega.selector";
import {
  actualizarMensajeError,
  cambiarEstadoError,
  cambiarEstadoSeleccionado,
  cambiarEstadoSinconizado,
  limpiarEntregaSeleccionada,
} from "@/src/modules/visita/application/slice/entrega.slice";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import { useEliminarEnGaleria } from "@/src/shared/hooks/useMediaLibrary";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Bell,
  FileCheck,
  FileQuestion,
  FileUp,
  FileWarning,
  FileX,
  MoreVertical,
  Package,
  Truck,
  XCircle,
} from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { useFocusEffect, useRouter } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { shallowEqual } from "react-redux";
import {
  Button,
  H4,
  H6,
  ListItem,
  Spinner,
  Text,
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
  const [permiso, setPermiso] = useState("");
  const [snapPointsMode] = useState<(typeof spModes)[number]>("mixed");
  const snapPoints = ["100%"];
  const entregas = useAppSelector(({ entregas }) => entregas.entregas || []);
  const arrEntregasConNovedad = useAppSelector(selectEntregasConNovedad);
  const arrEntregasSinconizado = useAppSelector(selectEntregasSincronizadas);

  useFocusEffect(
    useCallback(() => {
      validacionPermisoLocalizacion();
    }, [])
  );

  const validacionPermisoLocalizacion = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setPermiso(status);
  };

  if (permiso !== "granted") {
    return null;
  }

  if (entregas.length === 0) {
    return null;
  }

  return (
    <>
      <XStack justify={"flex-end"} items="center" gap="$2">
        <XStack gap="$2">
          <XStack items="flex-end" gap="$1">
            <Package size={12} color="$blue10" />
            <Text fontSize="$2" fontWeight="600" color="$blue10">
              {entregas.length}
            </Text>
          </XStack>
          <XStack items="center" gap="$1">
            <Bell size={12} color="orange" />
            <Text fontSize="$2" fontWeight="600" color="orange">
              {arrEntregasConNovedad.length}
            </Text>
          </XStack>
        </XStack>
        <XStack gap="$2">
          <XStack items="center" gap="$1">
            <Truck size={12} color="$green10" />
            <Text fontSize="$2" fontWeight="600" color="$green10">
              {arrEntregasSinconizado.length}
            </Text>
          </XStack>
        </XStack>
      </XStack>

      <Button
        icon={<MoreVertical size={"$1.5"} />}
        onPress={() => setOpen(true)}
        marginEnd={"$-0.75"}
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

  const arrEntregasConNovedad = useAppSelector(selectEntregasConNovedad);
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

  const confirmarSincornizarEntregas = async () => {
    setOpen(false);
    mostrarAlertHook({
      titulo: alertas.titulo.advertencia,
      mensaje: alertas.mensaje.accionIrreversible,
      onAceptar: () => gestionGuias(),
    });
  };

  const gestionGuias = async () => {
    try {
      setLoadSincronizando(true);
      if (Platform.OS === "android") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Se necesitan permisos para guardar en la galería");
          return;
        }
      }

      const subdominio = await AsyncStorage.getItem("subdominio");
      if (!subdominio) {
        console.warn("⚠️ No se encontró el subdominio en AsyncStorage");
        return;
      }

      for (const entrega of arrEntregasPendientes) {
        try {
          let imagenes: { base64: string }[] = [];

          const formDataToSend = new FormData();
          formDataToSend.append("id", `${entrega.id}`);
          formDataToSend.append("fecha_entrega", entrega.fecha_entrega);
          if (entrega.arrImagenes) {
            entrega.arrImagenes.forEach((archivo, index) => {
              // Crear un objeto File-like compatible con FormData
              const file = {
                uri: archivo.uri,
                name: `image-${index}.jpg`, // Usar nombre del archivo o generar uno
                type: "image/jpeg", // Tipo MIME por defecto
              };

              // La forma correcta de adjuntar archivos en React Native
              formDataToSend.append(
                `imagenes`,
                file as any,
                `image-${index}.jpg`
              ); // Usamos 'as any' para evitar el error de tipo
            });
          } else {
            formDataToSend.append(`imagenes`, [].toString()); // Usamos 'as any' para evitar el error de tipo
          }

          // 3️ Enviar datos al servidor (si falla, NO se borran imágenes ni se marca como sincronizado)
          await consultarApi<any>(APIS.ruteo.visitaEntrega, formDataToSend, {
            requiereToken: true,
            subdominio,
          });

          dispatch(cambiarEstadoSinconizado(entrega.id));
          setLoadSincronizando(false);
        } catch (error: any) {
          setOpen(true);
          setLoadSincronizando(false);
          dispatch(cambiarEstadoError(entrega.id));
          dispatch(
            actualizarMensajeError({
              entregaId: entrega.id,
              mensaje: error.response?.data?.mensaje,
            })
          );
          console.error(`❌ Error en la entrega ${entrega.id}:`, error);
          continue;
        }
      }
    } catch (error) {
      setLoadSincronizando(false);
      console.error("Error general en gestionGuias:", error);
    }
  };

  const gestionGuiasNovedades = async () => {
    setLoadSincronizandoNovedad(true);

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Se necesitan permisos para guardar en la galería");
      return;
    }

    const subdominio = await AsyncStorage.getItem("subdominio");
    if (!subdominio) {
      console.warn("⚠️ No se encontró el subdominio en AsyncStorage");
      return;
    }

    for (const novedad of arrEntregasConNovedad) {
      try {
        let imagenes: { base64: string }[] = [];
        // 1️ Procesar imágenes (si existen)
        if (novedad.arrImagenes?.length > 0) {
          for (const imagen of novedad.arrImagenes) {
            const fileInfo = await FileSystem.getInfoAsync(imagen.uri);
            if (!fileInfo.exists) {
              console.warn(`⚠️ Imagen no encontrada: ${imagen.uri}`);
              continue;
            }
            const base64 = await FileSystem.readAsStringAsync(imagen.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            imagenes.push({ base64: `data:image/jpeg;base64,${base64}` });
          }
        }

        const respuestaNovedad = await consultarApi<any>(
          APIS.ruteo.novedad,
          {
            visita: novedad.id,
            descripcion: novedad.novedad_descripcion,
            novedad_tipo: novedad.novedad_tipo,
            imagenes,
          },
          {
            requiereToken: true,
            subdominio,
          }
        );

        // 4️ Solo si la API responde OK, borrar archivos y marcar como sincronizado
        if (novedad.arrImagenes?.length > 0) {
          for (const img of novedad.arrImagenes) {
            const fileInfo = await FileSystem.getInfoAsync(img.uri);
            if (fileInfo.exists) await eliminarArchivo(img.uri);
          }
        }

        setLoadSincronizando(false);
        dispatch(cambiarEstadoSinconizado(novedad.id));
        setOpen(false);
      } catch (error) {
        console.error("❌ Error procesando novedad:", error);
      }
    }

    setLoadSincronizandoNovedad(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
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
      <YGroup width={"auto"} flex={1} size="$4" gap="$4">
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
              cantidad={arrEntregasConNovedad.length}
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
            <CardDesvincularOrdenEntrega close={() => setOpen(false)} />
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
          arrEntregasConNovedad.length > 0 ? (
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
                {arrEntregasConNovedad.length > 0 ? (
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
                    subTitle={
                      "Cantidad con novedades: " + arrEntregasConNovedad.length
                    }
                    onPress={() => navegarEntregaPendietes()}
                  />
                ) : null}
              </>
            </>
          ) : null}
        </YGroup.Item>
      </YGroup>
    </SafeAreaView>
  );
});
