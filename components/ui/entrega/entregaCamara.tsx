import { Camera as CameraIcons, Circle } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { memo, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, H4, Text, View } from "tamagui";
import * as MediaLibrary from 'expo-media-library';

const spModes = ["percent", "constant", "fit", "mixed"] as const;

export const EntregaCamara = ({
  onCapture,
}: {
  onCapture: (base64: string) => void;
}) => {
  const [position, setPosition] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modal] = React.useState(true);
  const [snapPointsMode] = React.useState<(typeof spModes)[number]>("mixed");
  const snapPoints = ["100%"];

  return (
    <>
      <Button
        icon={<CameraIcons size="$2" />}
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
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean>(false);

  const cameraRef = useRef<any>(null);
  const [facing] = useState<CameraType>("back");


  useEffect(() => {
    (async () => {
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaStatus.status === 'granted');
    })();
  }, []);

  if (!permission && !hasMediaLibraryPermission) {
    // Camera permissions are still loading.
    return (
      <View px="$4">
      <H4 mb="$2">Información</H4>

      <Text mb="$4">No se cuenta con el permiso de la camara</Text>
    </View>
    );
  }

  if (!permission.granted && !hasMediaLibraryPermission) {
    // Camera permissions are not granted yet.
    return (
      <View px="$4">
        <H4 mb="$2">Información</H4>

        <Text mb="$4">Necesitamos su permiso para mostrar la cámara y galeria.</Text>
        <Button onPress={requestPermission} variant="outlined">
          Conceder permiso
        </Button>
      </View>
    );
  }

  const tomarFoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        onCapture(photo.uri);
        setOpen(false);
      }
    } catch (error) {
      console.log("Error al tomar la foto:", error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Button
                onPress={tomarFoto}
                size="$4"
                circular
                icon={
                  <Circle
                    size="$4"
                    backgroundColor={"#ffff"}
                    style={{ borderRadius: 999 }} // Añade un borderRadius alto para formar un círculo
                  />
                }
                variant="outlined"
              />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
});
