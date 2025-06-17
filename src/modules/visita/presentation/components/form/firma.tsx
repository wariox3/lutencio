import { PencilLine, XCircle } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import { Button, H4, Text, View } from "tamagui";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import COLORES from "@/src/core/constants/colores.constant";

const spModes = ["percent", "constant", "fit", "mixed"] as const;

export const EntregaFirma = ({
  onCapture,
}: {
  onCapture: (base64: string) => void;
}) => {
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [modal] = useState(true);
  const [snapPointsMode] = useState<(typeof spModes)[number]>("percent");
  const snapPoints = [100];
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState<boolean>(false);
  const { obtenerColor } = useTemaVisual();

  useEffect(() => {
    (async () => {
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaStatus.status === "granted");
    })();
  }, []);

  if (!hasMediaLibraryPermission) {
    return (
      <View px="$4">
        <H4 mb="$2">Información</H4>
        <Text mb="$4">No se cuenta con el permiso de la galeria</Text>
      </View>
    );
  }

  if (!hasMediaLibraryPermission) {
    return (
      <View px="$4">
        <H4 mb="$2">Información</H4>

        <Text mb="$4">Necesitamos su permiso para mostrar galeria.</Text>
        <Button variant="outlined">Conceder permiso</Button>
      </View>
    );
  }

  return (
    <>
      <Button
        icon={<PencilLine size="$2" />}
        onPress={() => setOpen(true)}
      ></Button>

      <Sheet
        forceRemoveScrollEnabled={open}
        modal={true}
        open={open}
        onOpenChange={setOpen}
        snapPoints={[50]} // Solo un punto al 100%
        snapPointsMode="percent"
        dismissOnSnapToBottom={false}
        zIndex={100_000}
        animation="medium"
        // Configuración para hacerlo fijo:
        disableDrag // Deshabilita el arrastre
        moveOnKeyboardChange={false}
      >
        <Sheet.Overlay
          animation="lazy"
          bg="$shadow6"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame
          style={{ flex: 1, backgroundColor: obtenerColor("BLANCO", "NEGRO") }}
        >
          <SheetContentsEntregaCamara setOpen={setOpen} onCapture={onCapture} />
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

// in general good to memoize the contents to avoid expensive renders during animations
const SheetContentsEntregaCamara = memo(({ setOpen, onCapture }: any) => {
  const ref = useRef<any>();
  const { height } = useWindowDimensions();
  const { obtenerColor, esquemaActual } = useTemaVisual();

  const handleOK = async (signature: string) => {
    try {
      const base64Code = signature.split(",")[1];
      const ahora = new Date();
      const fechaHora = ahora
        .toISOString()
        .replace(/T/, "_")
        .replace(/\..+/, "")
        .replace(/-/g, "")
        .replace(/:/g, "");

      const fileUri = FileSystem.documentDirectory + `firma_${fechaHora}.png`;

      await FileSystem.writeAsStringAsync(fileUri, base64Code, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // const { status } = await MediaLibrary.requestPermissionsAsync();
      // if (status !== "granted") {
      //   alert("❌ Permiso denegado para acceder a la galería");
      //   return;
      // }
      //const asset = await MediaLibrary.createAssetAsync(fileUri);
      onCapture(fileUri);
      //setOpen(false);
    } catch (error) {
      console.error("❌ Error al guardar la firma:", error);
    }
  };

  const handleEmpty = () => {};

  const handleClear = () => {};

  // Called after end of stroke
  const handleEnd = () => {
    ref.current.readSignature();
  };

  // Called after ref.current.getData()
  const handleData = (data: any) => {};

  const webStyle = useMemo(() => {
    const isDarkMode = esquemaActual === 'dark';
    const background = isDarkMode ? COLORES.GRIS_OSCURO : COLORES.BLANCO;
    const color = isDarkMode ? COLORES.BLANCO : COLORES.NEGRO;
  
    return `
      body, html {
        background-color: ${background};
      }
  
      .m-signature-pad {
        background-color: ${background};
        border: 2px solid ${background};
      }
  
      .m-signature-pad--body {
        border: 2px solid ${background};
      }
  
      .m-signature-pad--footer {
        color: ${color};
      }
  
      .m-signature-pad--footer .button {
        color: ${color};
      }
  
      canvas {
        background-color: ${background};
        border: 2px solid ${background};
      }
    `;
  }, [esquemaActual]);
  return (
    <View flex={1} bg={obtenerColor("BLANCO", "NEGRO")}>
      <Button
        size="$4"
        circular
        icon={<XCircle size="$3" color={"red"} />}
        style={styles.botonCerrar}
        onPress={() => setOpen(false)}
      />

      <SignatureScreen
        ref={ref}
        onEnd={() => handleEnd}
        onOK={handleOK}
        onEmpty={handleEmpty}
        onClear={handleClear}
        autoClear={true}
        descriptionText={"Ingresa firma"}
        clearText="Limpiar"
        confirmText="Aceptar"
        style={{ height: height }}
        webStyle={webStyle}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  botonCerrar: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 100,
  },
  firmaContenedor: {
    flex: 1,
  },
  signature: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
