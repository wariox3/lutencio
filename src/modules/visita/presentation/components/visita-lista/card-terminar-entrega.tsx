import { Card, H6, Text } from "tamagui";
import CardDesvincularOrdenEntrega from "../opciones/card-desvincular-orden-entrega";

const CardTerminarEntrega = () => {

  return (
    <>
      <Card
        flex={0.1}
        my={"$2"}
        borderStyle={"dashed"}
        bordered
        padding={16}
        mx={"$2"}
      >
        <H6 mb="$2">Terminar viaje</H6>
        <Text mb="$4">
          Ya no tienes mas visitas por entregar puede terminar el viaje o
          desvincular el actual
        </Text>
        <CardDesvincularOrdenEntrega
          close={() => ()=>{}}
          titulo="Terminar"
          mensaje="Retirar la orden de entrega actual y visitas"
          textoColor="VERDE_FUERTE"
          bgColor="VERDE_SUAVE"
          validaEntregasPendentesSincronizar={true}
        />
      </Card>
    </>
  );
};

export default CardTerminarEntrega;
