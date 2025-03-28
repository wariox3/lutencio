import APIS from "@/constants/endpoint";
import { RootState } from "@/store/reducers";
import {
  cambiarEstadoSeleccionado,
  cambiarEstadoSinconizado,
  limpiarEntregaSeleccionada,
  quitarEntregaGestion,
} from "@/store/reducers/entregaReducer";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ClipboardPlus,
  ClipboardX,
  FileStack,
  FileUp,
  FileX,
  MoreVertical,
  XCircle,
} from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, H4, H6, ListItem, XStack, YGroup } from "tamagui";

const spModes = ["percent", "constant", "fit", "mixed"] as const;

export const EntregaOpciones = () => {
  const entregasSeleccionadas = useSelector(
    (state: RootState) => state.entregas.entregasSeleccionadas || []
  );
  const entregasGestion = useSelector(
    (state: RootState) => state.entregas.gestion || []
  );
  const [position, setPosition] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modal] = React.useState(true);
  const [snapPointsMode] = React.useState<(typeof spModes)[number]>("mixed");
  const snapPoints = ["100%"];

  return (
    <>
      <Button icon={MoreVertical} onPress={() => setOpen(true)}></Button>

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
          <SheetContents
            {...{ setOpen, entregasSeleccionadas, entregasGestion }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

// in general good to memoize the contents to avoid expensive renders during animations
const SheetContents = memo(
  ({ setOpen, entregasSeleccionadas, entregasGestion }: any) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const arrEntregas = useSelector(
      (state: RootState) => state.entregas.gestion || []
    );
    const navegarEntregaCargar = () => {
      router.push("/(app)/(maindreawer)/entregaCargar");
      setOpen(false);
    };

    const navegarEntregaGestion = () => {
      router.push("/(app)/(maindreawer)/entregaGestion");
      setOpen(false);
    };

    const retirarSeleccionadas = () => {
      setOpen(false);
      entregasSeleccionadas.map((entrega: number) => {
        dispatch(cambiarEstadoSeleccionado(entrega));
      });
      dispatch(limpiarEntregaSeleccionada());
    };

    const gestionGuias = async () => {
      try {

        if (Platform.OS === 'android') {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== 'granted') {
            alert('Se necesitan permisos para guardar en la galería');
            return;
          }
        }
      

        const subdominio = await AsyncStorage.getItem("subdominio");
        if (!subdominio) {
          console.warn("⚠️ No se encontró el subdominio en AsyncStorage");
          return;
        }

        for (const entrega of arrEntregas) {
          let imagenes: { base64: string }[] = [];

          // Verificar si entrega tiene imágenes
          if (entrega.arrImagenes && entrega.arrImagenes.length > 0) {
            for (const img of entrega.arrImagenes) {
              if (img.base64.startsWith("file://")) {
                // Verificar si el archivo existe
                const fileInfo = await FileSystem.getInfoAsync(img.base64);
                if (!fileInfo.exists) {
                  console.warn(`⚠️ Imagen no encontrada: ${img.base64}`);
                  continue; // Saltar esta imagen si fue eliminada
                }

                // Convertir la imagen a Base64
                const base64 = await FileSystem.readAsStringAsync(img.base64, {
                  encoding: FileSystem.EncodingType.Base64,
                });

                imagenes.push({ base64: `data:image/jpeg;base64,${base64}` });
              }
            }
          }

          // Verificar si hay una firma y convertirla a Base64
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

          // Iterar sobre las guías y enviar la información
          for (const guia of entrega.guias) {
            console.log(`📤 Enviando guía: ${guia}`);

            const respuestaApi = await consultarApi<any>(
              APIS.entrega.ruteoVisitaEntrega,
              {
                id: guia,
                imagenes: imagenes, // Enviar imágenes convertidas
              },
              {
                requiereToken: true,
                subdominio: subdominio,
              }
            );

            //Borrar las imágenes después de éxito

            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
              console.log('Permiso  para acceder a la galería');
            }

            for (const img of entrega.arrImagenes) {
              const fileInfo = await FileSystem.getInfoAsync(img.base64);
              if (fileInfo.exists) {
                await FileSystem.deleteAsync(img.base64);
                const asset = await MediaLibrary.createAssetAsync(img.base64);
                await MediaLibrary.deleteAssetsAsync([asset]);
              } 
            }

            //Borrar las firma después de éxito
            if (entrega.firmarBase64) {
              const fileInfo = await FileSystem.getInfoAsync(
                entrega.firmarBase64
              );
              if (fileInfo.exists) {
                let eliminarFirma = await FileSystem.deleteAsync(entrega.firmarBase64);
              }
            }

            //cambiar estado estado_sinconizado
            dispatch(cambiarEstadoSinconizado(guia));
          }

          //retriar la entrega
          const indice = arrEntregas.indexOf(entrega);
          dispatch(quitarEntregaGestion(indice));
        }
      } catch (error) {
        console.log("❌ Error en gestionGuias:", error);
      }
    };

    return (
      <>
        <XStack justify="space-between">
          <H4 mb="$2">Opciones</H4>
          <Button
            size="$4"
            circular
            icon={<XCircle size="$3" />}
            onPress={() => setOpen(false)}
          />
        </XStack>
        <YGroup width={"auto"} flex={1} size="$4" gap="$4">
          <H6>Despacho</H6>

          <YGroup.Item>
            <ListItem
              hoverTheme
              icon={<ClipboardPlus size="$2" />}
              title="Cargar"
              subTitle="obtener información de un despacho"
              onPress={() => navegarEntregaCargar()}
            />
            <ListItem
              hoverTheme
              icon={<ClipboardX size="$2" />}
              title="Retirar"
              subTitle="Retire el despacho actual"
            />

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

            {entregasGestion.length > 0 ? (
              <>
                <H6 mb="$2">Gestión</H6>
                <ListItem
                  hoverTheme
                  icon={<FileStack size="$2" />}
                  title="Gestiones"
                  subTitle="Ver información de las gestiones hechas"
                  onPress={() => navegarEntregaGestion()}
                />
                <ListItem
                  hoverTheme
                  icon={<FileUp size="$2" />}
                  title="Sincronizar"
                  subTitle="Cargar a la nube las gestiones realizadas"
                  onPress={() => gestionGuias()}
                />
              </>
            ) : null}
          </YGroup.Item>
        </YGroup>

        
      </>
    );
  }
);
