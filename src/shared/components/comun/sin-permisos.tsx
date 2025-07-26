import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { Button, Card, H4, Separator, Text, YStack } from "tamagui";

const abrirConfiguracion = () => {
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:");
  } else {
    Linking.openSettings();
  }
};

const SinPermisos = () => {
  return (
    
    <Card  m={'$3'} size="$4" theme="red" padding={20} bordered >
      <YStack gap="$3">
        <H4 color="$red10">Permisos requeridos</H4>

        <Text>
          Para que la aplicación funcione correctamente, se necesitan los siguientes permisos:
        </Text>

        <Separator />

        <Text>
          📷 <Text fontWeight="bold">Cámara:</Text> para capturar imágenes o escanear códigos QR.
        </Text>
        <Text>
          🌍 <Text fontWeight="bold">Ubicación:</Text> necesaria para registrar tu posición en las visitas.
        </Text>
        <Text>
          🖼️ <Text fontWeight="bold">Multimedia:</Text> permite guardar y acceder a fotos desde la galería.
        </Text>
        <Text>
          🔔 <Text fontWeight="bold">Notificaciones:</Text> para avisarte sobre tareas o novedades importantes.
        </Text>

        <Separator />

        <Button theme="active" size="$4" onPress={abrirConfiguracion}>
          Abrir configuración del sistema
        </Button>

        <Text color="$red10" fontSize="$2" mt="$2">
          Una vez concedidos los permisos, vuelve a esta pantalla para continuar.
        </Text>
      </YStack>
    </Card>
  );
};

export default SinPermisos;
