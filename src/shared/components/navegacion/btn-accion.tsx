import { Button, Text } from "tamagui";
import { BtnAccionProps } from "../../interface/comun";

export const BotonAccion = ({
    onPress,
    icon,
    texto,
    mostrarCantidad,
    cantidad = 0,
  }: BtnAccionProps) => {
    return (
      <Button
        onPress={onPress}
        size="$4.5"
        bg={mostrarCantidad ? "$blue10" : "$blue4"}
        icon={icon}
        disabled={!mostrarCantidad}
        flex={1}
        color={mostrarCantidad ? "white" : "black"}
      >
        {texto}
        {mostrarCantidad && <Text color={'white'}>({cantidad})</Text>}
      </Button>
    );
  };