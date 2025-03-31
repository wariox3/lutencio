import APIS from "@/constants/endpoint";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { Entrega } from "@/interface/entrega/entrega";
import { RootState } from "@/store/reducers";
import {
  cambiarEstadoSinconizado
} from "@/store/reducers/entregaReducer";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FileUp } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { memo } from "react";
import { Alert, Platform } from "react-native";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Button, Spinner } from "tamagui";

const spModes = ["percent", "constant", "fit", "mixed"] as const;

export const EntregaSincronizar = () => {
  const [position, setPosition] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modal] = React.useState(true);
  const [snapPointsMode] = React.useState<(typeof spModes)[number]>("mixed");
  const dispatch = useDispatch();
  const snapPoints = ["100%"];
  const arrEntregas = useSelector(
    (state: RootState) =>
      state.entregas.entregas.filter(
        (entrega: Entrega) =>
          entrega.estado_entregado === true &&
          entrega.estado_sincronizado === false
      ) || [],
    shallowEqual
  );
  const { deleteFileFromGallery, isDeleting, error } = useMediaLibrary();

  const confirmarRetirarDespacho = async () => {
    Alert.alert(
      "⚠️ Advertencia",
      "Esta acción retirara las entregas y las visitas pendientes por sincronizar no se puede desacer una vez completa",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
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
    setOpen(true);
    try {
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

      for (const entrega of arrEntregas) {
        let imagenes: { base64: string }[] = [];
        // Verificar si entrega tiene imágenes
        if (entrega.arrImagenes && entrega.arrImagenes.length > 0) {
          for (const imagen of entrega.arrImagenes) {
            if (imagen.uri.startsWith("file://")) {
              // Verificar si el archivo existe
              const fileInfo = await FileSystem.getInfoAsync(imagen.uri);
              if (!fileInfo.exists) {
                console.warn(`⚠️ Imagen no encontrada: ${imagen.uri}`);
                continue; // Saltar esta imagen si fue eliminada
              }
              // Convertir la imagen a Base64
              const base64 = await FileSystem.readAsStringAsync(imagen.uri, {
                encoding: FileSystem.EncodingType.Base64,
              });
              imagenes.push({ base64: `data:image/jpeg;base64,${base64}` });
            }
          }
        }
        // Verificar si hay una firma y convertirla a Base64
        let firmaBase64 = null;
        if (entrega.firmarBase64?.startsWith("file://")) {
          const fileInfo = await FileSystem.getInfoAsync(entrega.firmarBase64);
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
        console.log(`📤 Enviando guía: ${entrega.id}`);
        await consultarApi<any>(
          APIS.ruteo.visitaEntrega,
          {
            id: entrega.id,
            imagenes: imagenes, // Enviar imágenes convertidas
          },
          {
            requiereToken: true,
            subdominio: subdominio,
          }
        );
        //Borrar las imágenes después de éxito
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          console.log("Permiso  para acceder a la galería");
        }
        if (entrega.arrImagenes && entrega.arrImagenes.length > 0) {
          for (const img of entrega.arrImagenes) {
            const fileInfo = await FileSystem.getInfoAsync(img.uri);
            if (fileInfo.exists) {
              await deleteFileFromGallery(img.uri);
            }
          }
        }
        //Borrar las firma después de éxito
        if (entrega.firmarBase64) {
          const fileInfo = await FileSystem.getInfoAsync(entrega.firmarBase64);
          if (fileInfo.exists) {
            await deleteFileFromGallery(entrega.firmarBase64);
          }
        }
        //cambiar estado estado_sincronizado
        dispatch(cambiarEstadoSinconizado(entrega.id));
        setOpen(false);
      }
    } catch (error) {
      console.log("❌ Error en gestionGuias:", error);
      setOpen(false);

    }
  };

  return (
    <>
      <Button
        icon={<FileUp size={"$1.5"}></FileUp>}
        onPress={() => {
          confirmarRetirarDespacho();
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
          <SheetContents2 {...{ setOpen }} />
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

// in general good to memoize the contents to avoid expensive renders during animations
const SheetContents2 = memo(({ setOpen }: any) => {
  return (
    <>
      <Spinner size={"large"}></Spinner>
    </>
  );
});
