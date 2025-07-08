import { GeneralApiRepository } from "@/src/core/api/repositories/general-api.service";
import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";
import { Entrega } from "@/src/modules/visita/domain/interfaces/vista.interface";
import { RuteoApiRepository } from "@/src/core/api/repositories/ruteo-api.service";
import storageService from "@/src/core/services/storage.service";
import { STORAGE_KEYS } from "@/src/core/constants";

export class VisitaApiRepository implements VisitaRepository {
  constructor(
    private generalApiService = new GeneralApiRepository(),
    private ruteoApiRepository = new RuteoApiRepository()
  ) {}

  async getLista(
    despachoId: number,
    estadoEntregado: boolean,
    subdominio: string
  ) {
    return this.generalApiService.consulta<Entrega[]>(
      {
        modelo: "RutVisita",
        filtros: [
          {
            propiedad: "despacho_id",
            valor1: despachoId,
            operador: "exact",
          },
          {
            propiedad: "estado_entregado",
            operador: "exact",
            valor1: estadoEntregado,
          },
        ],
        limite: 1000
      },
      subdominio
    );
  }

  async setNovedad(
    visita: number,
    descripcion: string,
    novedad_tipo: string,
    imagenes: any,
    fecha_entrega: any
  ): Promise<any> {
    const subdominio = (await storageService.getItem(
      STORAGE_KEYS.subdominio
    )) as string;
    const formData = new FormData()
    formData.append('visita_id', `${visita}`);
    formData.append('descripcion', descripcion);
    formData.append('novedad_tipo_id', novedad_tipo);
    formData.append("fecha", fecha_entrega);
    imagenes.forEach((archivo: any, index: number) => {
      // Crear un objeto File-like compatible con FormData
      const file = {
        uri: archivo.uri,
        name: `image-${index}.jpg`, // Usar nombre del archivo o generar uno
        type: 'image/jpeg' // Tipo MIME por defecto
      };
    
      // La forma correcta de adjuntar archivos en React Native
      formData.append(`imagenes`, file as any, `image-${index}.jpg`); // Usamos 'as any' para evitar el error de tipo
    });


    return this.ruteoApiRepository.postNovedad(
      formData,
      subdominio
    );
  }

  async setNovedadSolucion(
    id: number,
    solucion: string,
  ): Promise<any> {
    const subdominio = (await storageService.getItem(
      STORAGE_KEYS.subdominio
    )) as string;
    return this.ruteoApiRepository.postNovedadSolucion(
      id,
      solucion,
      subdominio
    );
  }

}
