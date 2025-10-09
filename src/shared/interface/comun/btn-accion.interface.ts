
export interface BtnAccionProps {
  onPress: () => void;
  icon: JSX.Element;
  texto: string;
  mostrarCantidad: boolean;
  cantidad?: number;
}
