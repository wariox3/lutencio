import { TIPOS_CODIGO_BARRA } from "@/src/core/constants";
import { ScanQrCode, XCircle } from "@tamagui/lucide-icons";
import { CameraView } from "expo-camera";
import { Button, H4, View, XStack } from "tamagui";
import { usePermiso } from "../../hooks/usePermiso";
import ReusableSheet from "./modal-sheet";
import SinPermisos from "./sin-permisos";

interface CamaraLectorCodigoProps {
  obtenerData: (data: string) => void;
}

const CamaraLectorCodigo = ({ obtenerData, }: CamaraLectorCodigoProps) => {
  const permisoCamara = usePermiso();

  const handleBarCodeScanned = ({ data }: { data: string }, close: () => void) => {
    obtenerData(data);
    close();
  };
  

  return (
    <ReusableSheet
      triggerContent={<ScanQrCode size={"$1.5"} />}
      triggerProps={{ unstyled: true }}
      sheetContents={({ close }) =>
        <>
          {
            permisoCamara === 'granted' ? (
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
            ) : (
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
                <SinPermisos />
              </>
            )
          }

        </>
      }
    />
  );
};

export default CamaraLectorCodigo;
