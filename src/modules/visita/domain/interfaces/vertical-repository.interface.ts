import { EntregaVertical } from "./entrega.interface";

export interface VerticalRepository {
  getEntregaPorCodigo(codigo: string): Promise<EntregaVertical>;
}
