import { ThemeName } from "tamagui";

export interface BtnAccionProps {
  onPress: () => void;
  icon: JSX.Element;
  texto: string;
  themeColor: ThemeName;
  mostrarCantidad: boolean;
  cantidad?: number;
}
