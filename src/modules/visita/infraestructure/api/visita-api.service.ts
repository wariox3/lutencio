import APIS from "@/src/core/api/domain/constants/endpoint.constant";
import { GeneralApiRepository } from "@/src/core/api/repositories/general-api.service";
import { RuteoApiRepository } from "@/src/core/api/repositories/ruteo-api.service";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { Entrega } from "@/src/modules/visita/domain/interfaces/vista.interface";
import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";

export class VisitaApiRepository implements VisitaRepository {
  constructor(
    private generalApiService = new GeneralApiRepository(),
    private ruteoApiRepository = new RuteoApiRepository()
  ) { }

  async getLista(
    despachoId: number,
    estadoEntregado: boolean,
    subdominio: string
  ) {
    return this.generalApiService.consultaApi<Entrega[]>(
      APIS.ruteo.visita,
      {
        despacho_id: despachoId,
        estado_entregado: estadoEntregado ? 'True' : 'False',
        estado_novedad: 'False',
        lista: true,
        serializador: 'lista'
      },
      {
        "X-Schema-Name": subdominio,
      }
    );
  }

  async postVisita(
    formData: any
  ) {
    const subdominio = (await storageService.getItem(
      STORAGE_KEYS.subdominio
    )) as string;
    return this.ruteoApiRepository.postVisita(
      formData,
      subdominio
    )
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

  async setUbiciacion(
    latitud: string,
    longitud: string,
  ) {
    const despacho = (await storageService.getItem(
      STORAGE_KEYS.despacho
    )) as string;
    const usuario_id = (await storageService.getItem(
      STORAGE_KEYS.usuarioId
    )) as string;
    const subdominio = (await storageService.getItem(
      STORAGE_KEYS.subdominio
    )) as string;
    return this.ruteoApiRepository.postUbicacionVisita(usuario_id, despacho, latitud, longitud, subdominio)
  }

}
