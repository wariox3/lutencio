import { EntregaVertical } from "./entrega.interface";

export interface VerticalRepository {
  getEntregaPorCodigo(codigo: number): Promise<EntregaVertical>;
}
