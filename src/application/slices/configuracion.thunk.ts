import APIS from "@/constants/endpoint";
import { RuteoApiRepository } from "@/src/core/api/repositories/ruteo-api.service";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { consultarApi } from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const configuracionThunk = createAsyncThunk(
    "configuracion/selector/novedad-tipo",
    async (payload, { rejectWithValue }) => {
     try {
        const subdominio = await storageService.getItem(STORAGE_KEYS.subdominio) as string
        const respuestaApiCargar = await consultarApi<any>(
         APIS.ruteo.novedadTipo,
         null,
         { requiereToken: true, method: "get", subdominio }
       );
         return respuestaApiCargar
     } catch (error: any) {
        return rejectWithValue(error);
     }   
    }
)