import { Camera as CameraIcons, Circle } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import { CameraType, CameraView } from "expo-camera";
import React, { memo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text, View } from "tamagui";
import Marker, { ImageFormat, Position, TextBackgroundType, TextMarkOptions } from "react-native-image-marker";
import useFecha from "@/src/shared/hooks/useFecha";
import { ImagenMetaData } from "../../../domain/interfaces/visita-imagen-metadata.interfase";

const spModes = ["percent", "constant", "fit", "mixed"] as const;

export const EntregaCamara = ({
  onCapture,
  imagenMetaData
}: {
  onCapture: (base64: string) => void;
  imagenMetaData: ImagenMetaData;
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
          <SheetContentsEntregaCamara setOpen={setOpen} onCapture={onCapture} imagenMetaData={imagenMetaData} />
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

const SheetContentsEntregaCamara = memo(({ setOpen, onCapture, imagenMetaData }: { setOpen: any; onCapture: (base64: string) => void; imagenMetaData: ImagenMetaData; }) => {


  const cameraRef = useRef<any>(null);
  const [facing] = useState<CameraType>("back");
  const { obtenerFechaYHoraActualFormateada } = useFecha();
  // ✅ Obtén tus textos dinámicos
  const fecha = obtenerFechaYHoraActualFormateada();
  const localizacion = imagenMetaData.localizacionNombre === ""
    ? "Sin cobertura GPS"
    : imagenMetaData.localizacionNombre;

  const tomarFoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 });

        const options = {
          backgroundImage: {
            src: photo.uri,
            scale: 1,
          },
          watermarkTexts: [
            {
              text: `${fecha}\n${localizacion}`,
              position: {
                position: Position.bottomRight,
                offsetX: 20,
                offsetY: 20,
              },
              style: {
                color: '#ffffff',
                fontSize: 30,
                fontName: 'Arial',
                shadowStyle: {
                  dx: 2,
                  dy: 2,
                  radius: 2,
                  color: '#000000',
                },
                textBackgroundStyle: {
                  padding: '2% 2%',
                  type: TextBackgroundType.none,
                  color: 'transparent',
                },
              },
            },
          ],
          scale: 1,
          quality: 100,
          filename: 'foto_con_metadata',
          saveFormat: ImageFormat.png,
        };

        // ✅ Genera la nueva foto con metadata
        const photoWithMeta = await Marker.markText(options);

        onCapture(photoWithMeta);
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
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>{obtenerFechaYHoraActualFormateada()}</Text>
            <Text style={styles.overlayText}>{localizacion}</Text>
          </View>

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
  overlay: {
    position: "absolute",
    bottom: 20,
    right: 10,
    marginBottom: 180,
    alignItems: "flex-end",
  },
  overlayText: {
    color: "white",
    fontSize: 16,
    textAlign: "right",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
