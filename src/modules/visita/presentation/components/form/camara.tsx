import { Camera as CameraIcons, Circle } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import { CameraType, CameraView } from "expo-camera";
import React, { memo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, View } from "tamagui";

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

const SheetContentsEntregaCamara = memo(({ setOpen, onCapture }: any) => {

  const cameraRef = useRef<any>(null);
  const [facing] = useState<CameraType>("back");

  const tomarFoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
          const now = new Date();

        onCapture(photo.uri);
        setOpen(false);
      }
    } catch (error) {
    }
  };

  return (
    <>
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Button
                onPressIn={tomarFoto}
                size="$7"
                circular
                color={"$red10"}
                theme={"red"}
                icon={
                  <Circle
                    size="$6"
                    color={'$red10'}
                  />
                }
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
    margin: 100,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
});
