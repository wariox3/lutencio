import { consultarApi } from "@/utils/api";
import { Novedad } from "../../domain/interfaces/novedad.interface";
import APIS from "@/src/core/constants/endpoint.constant";
import { Entrega } from "@/interface/entrega/entrega";
import { useProcesarImagenes } from "@/src/shared/hooks/useMediaLibrary";


export class NovedadService {
  static async sincronizarNovedad(
    novedad: Entrega, 
    subdominio: string | null
  ): Promise<boolean> {
    if (!subdominio) return false;

    try {
      let imagenes: any[] = [];
      
      if (novedad.arrImagenes?.length) {
        imagenes = await useProcesarImagenes(novedad.arrImagenes);
      }

      const respuesta = await consultarApi<any>(
        APIS.ruteo.novedad,
        {
          visita: novedad.id,
          descripcion: novedad.novedad_descripcion,
          novedad_tipo: novedad.novedad_tipo,
          imagenes,
        },
        {
          requiereToken: true,
          subdominio,
        }
      );

      return respuesta.success;
    } catch (error) {
      console.error('Error sincronizando novedad:', error);
      return false;
    }
  }
}