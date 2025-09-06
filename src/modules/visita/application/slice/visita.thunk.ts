import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { iniciarTareaSeguimientoUbicacion } from "@/utils/services/locationService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { VerticalApiRepository } from "../../infraestructure/api/vertical-api.service";
import {
  GetListaVisitaUseCase,
  SetNovedadSolucionVisitaUseCase,
  SetEntregaVisitaUseCase,
  SetSeguiminetoVisitaUseCase,
} from "../use-cases";
import { SetNovedadVisitaUseCase } from "../use-cases/set-novedad-visita.use-case";

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
          
        if (visitas.length > 0) {
          await storageService.setItem(STORAGE_KEYS.subdominio, schema_name);
          await storageService.setItem(STORAGE_KEYS.despacho, `${despacho_id}`);
          await storageService.setItem(
            STORAGE_KEYS.ordenEntrega,
            `${payload.codigo}`
          );

          await iniciarTareaSeguimientoUbicacion();
        }

        return visitas;
      }

      return [];
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const visitaEntregaThunk = createAsyncThunk(
  "visita/guardar-visita",
  async (payload: { formData: any; visitaId: number }, { rejectWithValue }) => {
    try {
      const respuestaVistaEntrega =
        await new SetEntregaVisitaUseCase().setVisita(payload.formData);
      return { ...respuestaVistaEntrega, visita: payload.visitaId };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const visitaNovedadThunk = createAsyncThunk(
  "visita/guardar-novedad",
  async (
    payload: {
      visita: number;
      descripcion: string;
      novedad_tipo: string;
      imagenes: any;
      fecha_entrega: any;
    },
    { rejectWithValue }
  ) => {
    try {
      const respuestaVistaNovedad =
        await new SetNovedadVisitaUseCase().setNovedad(
          payload.visita,
          payload.descripcion,
          payload.novedad_tipo,
          payload.imagenes,
          payload.fecha_entrega
        );
      return { ...respuestaVistaNovedad, visita: payload.visita };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const visitaNovedadSolucionThunk = createAsyncThunk(
  "visita/guardar-novedad-solucion",
  async (
    payload: { id: number; solucion: string; visita: number },
    { rejectWithValue }
  ) => {
    try {
      const respuestaVisitaSolucionNovedad =
        await new SetNovedadSolucionVisitaUseCase().setNovedadSolucion(
          payload.id,
          payload.solucion
        );
      return { ...respuestaVisitaSolucionNovedad, visita: payload.visita };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const visitaSeguimientoThunk = createAsyncThunk(
  "visita/seguimiento",
  async (
    payload: {
      cantidadCargadas: number;
      cantidadEntregasLocales: number;
      cantidadNovedadesLocales: number;
      cantidadNovedadesLocalesPendienteSinconizar: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const respuestaVisitaSeguimiento =
        await new SetSeguiminetoVisitaUseCase().setSeguimiento(
          payload.cantidadCargadas,
          payload.cantidadEntregasLocales,
          payload.cantidadNovedadesLocales,
          payload.cantidadNovedadesLocalesPendienteSinconizar
        );
        return { ...respuestaVisitaSeguimiento };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
