import { Entrega } from "./vista.interface";
import { Novedad } from "@/src/modules/novedad/domain/novedad.interface";

export interface EntregaConNovedad extends Entrega {
  novedades: Novedad[];
}

export interface ItemListaProps {
  visita: EntregaConNovedad;
}