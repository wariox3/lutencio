import { Entrega } from "@/interface/entrega/entrega";

export interface ItemListaProps {
    visita: Entrega;
    onPress: (id: number) => void;
  }