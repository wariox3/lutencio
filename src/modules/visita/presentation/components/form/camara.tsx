import { Camera as CameraIcons, Circle } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import { CameraView, useCameraPermissions } from "expo-camera";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text, View } from "tamagui";

export const EntregaCamara = ({
  onCapture,
  disabled = false,
}: {
  onCapture: (uri: string) => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(0);

  const abrirCamara = useCallback(async () => {
    if (disabled) return;
    Keyboard.dismiss();
    setOpen(true);
  }, [disabled]);

  return (
    <>
      <Button
        icon={<CameraIcons size="$2" />}
        onPress={abrirCamara}
        disabled={disabled}
        opacity={disabled ? 0.5 : 1}
      />
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
        unmountChildrenWhenHidden
      >
        <Sheet.Overlay bg="transparent" />
        <Sheet.Handle />
        <Sheet.Frame>
          <SheetContentsEntregaCamara setOpen={setOpen} onCapture={onCapture} />
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

const SheetContentsEntregaCamara = memo(
  ({
    setOpen,
    onCapture,
  }: {
    setOpen: (v: boolean) => void;
    onCapture: (uri: string) => void;
  }) => {
    const cameraRef = useRef<any>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
      return () => {
        if (cameraRef.current) {
          cameraRef.current.pausePreview?.();
          cameraRef.current = null;
        }
      };
    }, []);

    const tomarFoto = useCallback(async () => {
      if (isCapturing) return;
      setIsCapturing(true);
      try {
        if (cameraRef.current) {
          const photo = await cameraRef.current.takePictureAsync({
            skipProcessing: true,
          });
          onCapture(photo.uri);
          setOpen(false);
        }
      } catch (error) {
        console.error("Error al tomar foto", error);
      } finally {
        setIsCapturing(false);
      }
    }, [isCapturing, onCapture, setOpen]);

    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back">
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={tomarFoto}
              disabled={isCapturing}
            >
              <Circle
                size={64}
                color={isCapturing ? "gray" : "red"}
                mb={"$12"}
              />
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
