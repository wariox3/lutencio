import { NovedadTipo } from "@/src/modules/visita/domain/interfaces/novedad-tipo.interface";
import { RespuestaApiGet } from "./api.interface";

export interface RuteoRepository {
  getNovedadTipoLista(subdominio: string): Promise<RespuestaApiGet<NovedadTipo>>;
  postNovedad(data: FormData, subdominio: string): Promise<any>;
}