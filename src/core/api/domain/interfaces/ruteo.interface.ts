import { NovedadTipo } from "@/src/modules/visita/domain/interfaces/novedad-tipo.interface";
import { RespuestaApi } from "./api.interface";

export interface RuteoRepository {
  getNovedadTipoLista(subdominio: string): Promise<RespuestaApi<NovedadTipo>>;
  postNovedad(data: FormData, subdominio: string): Promise<any>;
}