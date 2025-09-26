import { Camera as CameraIcons, Circle } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { memo, useRef, useState, useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, H4, Text, View } from "tamagui";

const spModes = ["percent", "constant", "fit", "mixed"] as const;

export const EntregaCamara = ({ onCapture }: { onCapture: (uri: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(0);

  return (
    <>
      <Button icon={<CameraIcons size="$2" />} onPress={() => setOpen(true)} />

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={["100%"]}
        snapPointsMode="mixed"
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          bg="$shadow6"
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

const SheetContentsEntregaCamara = memo(
  ({ setOpen, onCapture }: { setOpen: (v: boolean) => void; onCapture: (uri: string) => void }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<any>(null);

    const tomarFoto = useCallback(async () => {
      try {
        if (cameraRef.current) {
          setOpen(false); // UX: cerrar primero
          const photo = await cameraRef.current.takePictureAsync({
            skipProcessing: true,
          });
          onCapture(photo.uri);
        }
      } catch (error) {
        console.error("Error al tomar foto", error);
      }
    }, [onCapture, setOpen]);

    if (!permission) {
      return (
        <View px="$4">
          <H4 mb="$2">Información</H4>
          <Text mb="$4">Cargando permisos...</Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View px="$4">
          <H4 mb="$2">Información</H4>
          <Text mb="$4">Necesitamos tu permiso para usar la cámara.</Text>
          <Button onPress={requestPermission} variant="outlined">
            Conceder permiso
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back">
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={tomarFoto}>
              <Circle size={64} color="red" mb={'$12'}/>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingBottom: 32,
  },
  button: { alignItems: "center" },
});
