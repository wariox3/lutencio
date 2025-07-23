import { useAppDispatch } from "@/src/application/store/hooks";
import { RuteoApiRepository } from "@/src/core/api/repositories/ruteo-api.service";
import { Entrega } from "@/src/modules/visita/domain/interfaces/vista.interface";
import { cambiarEstadoSinconizado } from "../../application/slice/entrega.slice";

export class NovedadService {
  static async sincronizarNovedad(
    novedad: Entrega,
    subdominio: string | null
  ): Promise<boolean> {
    if (!subdominio) return false;
    const dispatch = useAppDispatch();

    try {
      const formData = new FormData();
      formData.append("visita_id", `${novedad.id}`);
      formData.append("descripcion", novedad.novedad_descripcion);
      formData.append("novedad_tipo_id", novedad.novedad_tipo);
      formData.append("fecha", novedad.fecha_entrega);
      
      novedad.arrImagenes.forEach((archivo: any, index: number) => {
        // Crear un objeto File-like compatible con FormData
        const file = {
          uri: archivo.uri,
          name: `image-${index}.jpg`, // Usar nombre del archivo o generar uno
          type: "image/jpeg", // Tipo MIME por defecto
        };
        // La forma correcta de adjuntar archivos en React Native
        formData.append(`imagenes`, file as any, `image-${index}.jpg`); // Usamos 'as any' para evitar el error de tipo
      });

      const respuesta = await new RuteoApiRepository().postNovedad(
        formData,
        subdominio
      );
      if (respuesta) {
        dispatch(cambiarEstadoSinconizado({ visitaId: novedad.id, nuevoEstado: false }));
      }

      return respuesta.success;
    } catch (error) {
      console.error("Error sincronizando novedad:", error);
      return false;
    }
  }
}
