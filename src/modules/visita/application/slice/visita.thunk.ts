import { createAsyncThunk } from "@reduxjs/toolkit";
import { VerticalApiRepository } from "../../infraestructure/api/vertical-api.service";
import storageService from "@/src/core/services/storage.service";
import { STORAGE_KEYS } from "@/src/core/constants";
import { iniciarTareaSeguimientoUbicacion } from "@/utils/services/locationService";
import { GetListaVisitaUseCase, SetNovedadVisitaUseCase } from "../use-cases";

export const cargarOrdenThunk = createAsyncThunk(
  "visita/cargar-orden",
  async (payload: { codigo: string }, { rejectWithValue }) => {
    try {
      const respuestaEntregaVertical =
        await new VerticalApiRepository().getEntregaPorCodigo(payload.codigo);

      if (respuestaEntregaVertical) {
        const { despacho_id, schema_name } = respuestaEntregaVertical;
        const visitas = await new GetListaVisitaUseCase().execute(
          despacho_id,
          false,
          schema_name
        );

        if (visitas.registros.length > 0) {
          await storageService.setItem(STORAGE_KEYS.subdominio, schema_name);
          await storageService.setItem(STORAGE_KEYS.despacho, `${despacho_id}`);
          await storageService.setItem(
            STORAGE_KEYS.ordenEntrega,
            `${payload.codigo}`
          );

          await iniciarTareaSeguimientoUbicacion();
        }

        return visitas.registros;
      }

      return [];
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const visitaNovedadThunk = createAsyncThunk(
  "visita/guardar-novedad",
  async (
    payload: { visita: number; descripcion: string; novedad_tipo: string },
    { rejectWithValue }
  ) => {
    try {      
      const respuestaVistaNovedad = await new SetNovedadVisitaUseCase().setNovedad(
        payload.visita,
        payload.descripcion,
        payload.novedad_tipo
      );
      return {...respuestaVistaNovedad, visita: payload.visita}
    } catch (error: any) {      
      return rejectWithValue(error);
    }
  }
);
