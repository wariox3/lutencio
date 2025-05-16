import APIS from "@/constants/endpoint";
import { useProcesarImagenes } from "@/hooks/useMediaLibrary";
import { Entrega } from "@/interface/entrega/entrega";
import { consultarApi } from "@/utils/api";

export class PenditesService {
  static async sincronizarPenditentes(
    entrega: Entrega,
    subdominio: string | null
  ) {
    if (!subdominio) return false;
    try {
      let imagenes: any[] = [];
      let firmaBase64 = null;

      if (entrega.arrImagenes?.length > 0) {
        imagenes = await useProcesarImagenes(entrega.arrImagenes);
      }
      if(entrega.firmarBase64){
        firmaBase64 = await useProcesarImagenes([{uri: entrega.firmarBase64}]);
      }

      await consultarApi<any>(
        APIS.ruteo.visitaEntrega,
        { id: entrega.id, imagenes },
        { requiereToken: true, subdominio }
      );

    } catch (error) {
      return false;
    }
  }
}
