import COLORES from "@/src/core/constants/colores.constant";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import { useRouter } from "expo-router";
import { Card, H6, Text } from "tamagui";

const SinElementos = () => {
  const router = useRouter();

  const navegarCargar = () => {
    router.navigate(rutasApp.vistaCargar);
  };

  return (
    <>
      <Card
        flex={0.1}
        my={"$2"}
        borderStyle={"dashed"}
        bordered
        bg={COLORES.ROJO_SUAVE}
        padding={16}
        mx={"$2"}
      >
        <H6 mb="$2">Gestión de Entregas </H6>
        <Text mb="$4">No tienes órdenes de entrega vinculadas. </Text>
      </Card>
    </>
  );
};

export default SinElementos;
