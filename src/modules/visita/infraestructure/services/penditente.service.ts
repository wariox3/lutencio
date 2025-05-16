import APIS from "@/constants/endpoint";
import { useProcesarImagenes } from "@/hooks/useMediaLibrary";
import { Entrega } from "@/interface/entrega/entrega";
import { useAppDispatch } from "@/src/application/store/hooks";
import { consultarApi } from "@/utils/api";
import { cambiarEstadoSinconizado } from "../../application/slice/entrega.slice";

export class PenditesService {
  static async sincronizarPenditentes(
    entrega: Entrega,
    subdominio: string | null
  ) {
    if (!subdominio) return false;
    const dispatch = useAppDispatch();

    try {
      let imagenes: any[] = [];
      let firmaBase64 = null;

      if (entrega.arrImagenes?.length > 0) {
        imagenes = await useProcesarImagenes(entrega.arrImagenes);
      }
      if (entrega.firmarBase64) {
        firmaBase64 = await useProcesarImagenes([
          { uri: entrega.firmarBase64 },
        ]);
      }      
      await consultarApi<any>(
        APIS.ruteo.visitaEntrega,
        { id: entrega.id, imagenes },
        { requiereToken: true, subdominio }
      );
      dispatch(cambiarEstadoSinconizado(entrega.id));
    } catch (error) {
      return false;
    }
  }
}
