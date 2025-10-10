import COLORES, { ColorKey } from "@/src/core/constants/colores.constant";
import { ClipboardX } from "@tamagui/lucide-icons";
import { Card, Text, XStack, YStack } from "tamagui";
import { useRetirarDespachoViewModel } from "../../../application/view-model/use-visita-requirar-orden-entrega.model";

const CardDesvincularOrdenEntrega = ({
  close,
  titulo,
  mensaje,
  textoColor,
  bgColor,
  validaEntregasPendentesSincronizar,
}: {
  close: () => void;
  titulo: string;
  mensaje: string;
  textoColor: ColorKey;
  bgColor: ColorKey;
  validaEntregasPendentesSincronizar: boolean;
}) => {
  const { confirmarRetirarDespacho } = useRetirarDespachoViewModel(close);

  return (
    <Card
      backgroundColor={COLORES[bgColor]}
      borderRadius="$4"
      padding="$3.5"
      width="100%"
      maxWidth="100%"
      onPress={() => confirmarRetirarDespacho(validaEntregasPendentesSincronizar)}
    >
      <XStack gap="$2" items="center" flexWrap="wrap">
        <ClipboardX size="$2" color={COLORES[textoColor]} />
        <YStack flex={1} gap="$2">
          <Text color={COLORES[textoColor]} fontWeight="bold">
            {titulo}
          </Text>
          <Text color={COLORES[textoColor]} numberOfLines={3} ellipsizeMode="tail">
            {mensaje}
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
};

export default CardDesvincularOrdenEntrega;
