import { Camera as CameraIcons, Circle } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import { CameraType, CameraView } from "expo-camera";
import React, { memo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text, View } from "tamagui";
import Marker, { ImageFormat, Position, TextBackgroundType, TextMarkOptions } from "react-native-image-marker";

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
  const direccion = "Calle 48A #99A-136\nEl Socorro, Medellín, Antioquia";
  const fecha = "16 de sept 2025";

  const tomarFoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 });

        const options: TextMarkOptions = {
          // background image
          backgroundImage: {
            src: photo.uri,
            scale: 1,
          },
          watermarkTexts: [{
            text: 'text marker \n multiline text',
            position: {
              position: Position.topLeft,
            },
            style: {
              color: '#ff00ff',
              fontSize: 30,
              fontName: 'Arial',
              shadowStyle: {
                dx: 10,
                dy: 10,
                radius: 10,
                color: '#008F6D',
              },
              textBackgroundStyle: {
                padding: '10% 10%',
                type: TextBackgroundType.none,
                color: '#0FFF00',
              },
            },
          }],
          quality: 100,
          filename: 'test',
          saveFormat: ImageFormat.jpg
        };
        const photo2 = await Marker.markText(options);
        
        onCapture(photo2);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      
    }
  };

  return (
    <>
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text items={'flex-end'} color={'white'} fontSize={'$4'}>{direccion}</Text>
              <Text items={'flex-end'} color={'white'} fontSize={'$4'}>{fecha}</Text>
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
