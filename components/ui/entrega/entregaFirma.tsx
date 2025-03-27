import { PencilLine } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import React, { memo, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import { Button, H4, Text, View } from "tamagui";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const spModes = ["percent", "constant", "fit", "mixed"] as const;

export const EntregaFirma = ({
  onCapture,
}: {
  onCapture: (base64: string) => void;
}) => {
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [modal] = useState(true);
  const [snapPointsMode] = useState<(typeof spModes)[number]>("mixed");
  const snapPoints = ["50%", 256, 190];
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState<boolean>(false);

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
          backgroundColor="$shadow6"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Frame>
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

  const handleOK = async (signature: string) => {
    try {
      const base64Code = signature.split(",")[1];
      const fileUri = FileSystem.documentDirectory + "firma.png";

      await FileSystem.writeAsStringAsync(fileUri, base64Code, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("❌ Permiso denegado para acceder a la galería");
        return;
      }
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      onCapture(asset.uri);
      setOpen(false);
    } catch (error) {
      console.error("❌ Error al guardar la firma:", error);
    }
  };

  const handleEmpty = () => {
    //console.log("Empty");
  };

  const handleClear = () => {
    //console.log("clear success!");
  };

  // Called after end of stroke
  const handleEnd = () => {
    ref.current.readSignature();
  };

  // Called after ref.current.getData()
  const handleData = (data: any) => {
    //console.log(data);
  };

  return (
    <SignatureScreen
      ref={ref}
      onEnd={handleEnd}
      onOK={handleOK}
      onEmpty={handleEmpty}
      onClear={handleClear}
      onGetData={handleData}
      autoClear={true}
      descriptionText={"Ingresa firma"}
      clearText="Limpiar"
      confirmText="Acceptar"
      style={{ height: height - 20 }}
    />
  );
});
