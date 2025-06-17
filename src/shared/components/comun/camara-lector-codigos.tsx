import React, { useState } from "react";
import { ScanQrCode, XCircle } from "@tamagui/lucide-icons";
import ReusableSheet from "./modal-sheet";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button, H4, Text, View, XStack } from "tamagui";
import { TIPOS_CODIGO_BARRA } from "@/src/core/constants";

interface CamaraLectorCodigoProps {
  obtenerData: (data: string) => void;
}

const CamaraLectorCodigo = ({ obtenerData, }: CamaraLectorCodigoProps) => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const handleBarCodeScanned = ({ data }: { data: string }, close: () => void) => {
    obtenerData(data);
    close();
  };

  if (!permission) {
    // La cámara está cargando
    return <View />;
  }

  if (!permission.granted) {
    // Los permisos no están concedidos
    return (
      <View>
        <Text>Necesitamos permiso para usar la cámara</Text>
        <Button onPress={requestPermission}>Conceder permiso</Button>
      </View>
    );
  }

  return (
    <ReusableSheet
      triggerContent={<ScanQrCode size={"$1.5"} />}
      triggerProps={{ unstyled: true }}
      sheetContents={ ({close}) =>
        <>
          <XStack justify="space-between" px={"$4"}>
            <H4 mb="$2">Escanear código</H4>
            <Button
              size="$4"
              circular
              icon={<XCircle size="$3" color={"$red10"} />}
              onPress={() => close()}
              theme={"red"}
            />
          </XStack>
          <View flex={1} justify={"center"}>
            <CameraView
              style={{ flex: 1 }}
              facing={"back"}
              barcodeScannerSettings={{
                barcodeTypes: Object.values(TIPOS_CODIGO_BARRA),
              }}
              onBarcodeScanned={(event) => handleBarCodeScanned(event, close)}
            />
          </View>
        </>
      }
    />
  );
};

export default CamaraLectorCodigo;
