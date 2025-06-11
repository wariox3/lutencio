import { Button, Text } from "tamagui";
import { BtnAccionProps } from "../../interface/comun";

export const BotonAccion = ({
    onPress,
    icon,
    texto,
    themeColor,
    mostrarCantidad,
    cantidad = 0,
  }: BtnAccionProps) => {
    return (
      <Button
        onPress={onPress}
        size="$4.5"
        theme={mostrarCantidad ? themeColor : "accent"}
        icon={icon}
        disabled={!mostrarCantidad}
      >
        {texto}
        {mostrarCantidad && <Text>({cantidad})</Text>}
      </Button>
    );
  };