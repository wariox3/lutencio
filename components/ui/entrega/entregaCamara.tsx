import { SwitchCamera, Camera as CameraIcons } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import {
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import React, { memo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text, View } from "tamagui";

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
  const snapPoints = ["100%", 256, 190];

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
  const cameraRef = useRef<any>(null);
  const [facing] = useState<CameraType>("back");

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>grant permission</Button>
      </View>
    );
  }

  const tomarFoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
          exif: true,
        });

        onCapture(photo.base64);
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
                icon={<SwitchCamera size="$3" />}
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
