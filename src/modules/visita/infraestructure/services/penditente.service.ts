import { Entrega } from "@/src/modules/visita/domain/interfaces/vista.interface";
// import { consultarApiFormData } from "@/utils/api";
import { SetEntregaVisitaUseCase } from "../../application/use-cases";

export class PenditesService {
  static async sincronizarPenditentes(
    entrega: Entrega,
    subdominio: string | null
  ) {
    if (!subdominio) return false;

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("id", `${entrega.id}`);
      formDataToSend.append("fecha_entrega", entrega.fecha_entrega);

      entrega.arrImagenes?.forEach((archivo: any, index: number) => {
        // Crear un objeto File-like compatible con FormData
        const file = {
          uri: archivo.uri,
          name: `image-${index}.jpg`, // Usar nombre del archivo o generar uno
          type: "image/jpeg", // Tipo MIME por defecto
        };

        // La forma correcta de adjuntar archivos en React Native
        formDataToSend.append(`imagenes`, file as any, `image-${index}.jpg`); // Usamos 'as any' para evitar el error de tipo
      });


      let filefirma: any = "";

      if (entrega.firmarBase64) {
        filefirma = {
          uri: entrega.firmarBase64,
          name: "firma",
          type: "image/jpeg", // Tipo MIME por defecto
        };
      }

      formDataToSend.append(`firmas`, filefirma as any, `firma.jpg`); // Usamos 'as any' para evitar el error de tipo

      // Agregar datos adicionales como JSON
      const datosAdicionales = {
        recibe: entrega.datosAdicionales.recibe,
        recibeParentesco: entrega.datosAdicionales.recibeParentesco,
        recibeNumeroIdentificacion:
          entrega.datosAdicionales.recibeNumeroIdentificacion,
        recibeCelular: entrega.datosAdicionales.recibeCelular,
      };

      formDataToSend.append(
        "datos_adicionales",
        JSON.stringify(datosAdicionales)
      );

      return new SetEntregaVisitaUseCase().setVisita(formDataToSend)
    } catch (error) {
      throw error;
    }
  }
}
