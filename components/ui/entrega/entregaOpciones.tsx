import APIS from "@/constants/endpoint";
import { rutasApp } from "@/constants/rutas";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { selectEntregasConNovedad } from "@/src/modules/visita/application/slice/entrega.selector";
import {
  actualizarMensajeError,
  cambiarEstadoError,
  cambiarEstadoSeleccionado,
  cambiarEstadoSinconizado,
  limpiarEntregaSeleccionada,
  quitarEntregas,
} from "@/src/modules/visita/application/slice/entrega.slice";
import { consultarApi } from "@/utils/api";
import { detenerTareaSeguimientoUbicacion } from "@/utils/services/locationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ClipboardPlus,
  ClipboardX,
  FileQuestion,
  FileUp,
  FileWarning,
  FileX,
  MoreVertical,
  XCircle,
} from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { useFocusEffect, useRouter } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { shallowEqual } from "react-redux";
import { Button, H4, H6, ListItem, Spinner, XStack, YGroup } from "tamagui";

const spModes = ["percent", "constant", "fit", "mixed"] as const;

export const EntregaOpciones = () => {
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [modal] = useState(true);
  const [permiso, setPermiso] = useState("");
  const [snapPointsMode] = useState<(typeof spModes)[number]>("mixed");
  const snapPoints = ["100%"];
  const entregas = useAppSelector(({ entregas }) => entregas.entregas || []);

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

  if(entregas.length === 0) {
    return null
  }

  return (
    <>
      <Button
        icon={<MoreVertical size={"$1.5"} />}
        onPress={() => setOpen(true)}
        variant="outlined"
        marginEnd={"$-0.75"}
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

  const { deleteFileFromGallery, isDeleting, error } = useMediaLibrary();
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

  const confirmarRetirarDespacho = async () => {
    Alert.alert(
      "⚠️ Advertencia",
      "Esta acción retirará las entregas y las visitas pendientes por sincronizar no se puede deshacer una vez completa",
      [
        {
          text: "Cancel",
        },
        { text: "Confirmar", onPress: () => retirarDespacho() },
      ]
    );
  };

  const confirmarSincornizarEntregas = async () => {
    Alert.alert(
      "⚠️ Advertencia",
      "Esta acción sincronizará las ordenes de entrega pendientes por sincronizar no se puede deshacer una vez completa",
      [
        {
          text: "Cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            gestionGuias();
          },
        },
      ]
    );
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

          // 1️ Procesar imágenes (si existen)
          if (entrega.arrImagenes?.length > 0) {
            for (const imagen of entrega.arrImagenes) {
              if (imagen.uri.startsWith("file://")) {
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
          }

          // 2️ Procesar firma (si existe)
          let firmaBase64 = null;
          if (entrega.firmarBase64?.startsWith("file://")) {
            const fileInfo = await FileSystem.getInfoAsync(
              entrega.firmarBase64
            );
            if (fileInfo.exists) {
              firmaBase64 = await FileSystem.readAsStringAsync(
                entrega.firmarBase64,
                {
                  encoding: FileSystem.EncodingType.Base64,
                }
              );
              firmaBase64 = `data:image/png;base64,${firmaBase64}`;
            } else {
              console.warn(`⚠️ Firma no encontrada: ${entrega.firmarBase64}`);
            }
          }

          // 3️ Enviar datos al servidor (si falla, NO se borran imágenes ni se marca como sincronizado)
          await consultarApi<any>(
            APIS.ruteo.visitaEntrega,
            { id: entrega.id, imagenes },
            { requiereToken: true, subdominio }
          );

          // 4️ Solo si la API responde OK, borrar archivos y marcar como sincronizado
          if (entrega.arrImagenes?.length > 0) {
            for (const img of entrega.arrImagenes) {
              const fileInfo = await FileSystem.getInfoAsync(img.uri);
              if (fileInfo.exists) await deleteFileFromGallery(img.uri);
            }
          }

          if (entrega.firmarBase64) {
            const fileInfo = await FileSystem.getInfoAsync(
              entrega.firmarBase64
            );
            if (fileInfo.exists)
              await deleteFileFromGallery(entrega.firmarBase64);
          }

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
            if (fileInfo.exists) await deleteFileFromGallery(img.uri);
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

  const retirarDespacho = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      //eliminar gestiones

      // deterner servicio de la ubicación
      await detenerTareaSeguimientoUbicacion();

      // Limpiar el despacho almacenado
      await AsyncStorage.removeItem("despacho");

      // Limpiar el subdominio almacenado
      await AsyncStorage.removeItem("subdominio");

      for (const entrega of entregas) {
        if (entrega.arrImagenes && entrega.arrImagenes.length > 0) {
          for (const img of entrega.arrImagenes) {
            const fileInfo = await FileSystem.getInfoAsync(img.uri);
            if (fileInfo.exists) {
              await deleteFileFromGallery(img.uri);
            }
          }
        }

        //eliminar firma
        if (entrega.firmarBase64) {
          const fileInfo = await FileSystem.getInfoAsync(entrega.firmarBase64);
          if (fileInfo.exists) {
            await deleteFileFromGallery(entrega.firmarBase64);
          }
        }
      }

      //retirar las entregas
      dispatch(quitarEntregas());

      //retirar entregas seleccionadas
      retirarSeleccionadas();

      //cerrar el sheet
      setOpen(false);
    }
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
          {entregas.length > 0 ? (
            <ListItem
              hoverTheme
              icon={<ClipboardX size="$2" />}
              title="Desvincular"
              subTitle="Desvincular la orden de entrega actual"
              onPress={() => confirmarRetirarDespacho()}
            />
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
                    onPress={() => gestionGuiasNovedades()}
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
