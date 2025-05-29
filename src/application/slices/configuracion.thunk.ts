import { RuteoApiRepository } from "@/src/core/api/repositories/ruteo-api.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const configuracionThunk = createAsyncThunk(
    "configuracion/selector/novedad-tipo",
    async (payload, { rejectWithValue }) => {
     try {
        const respuestaApiCargar = await new RuteoApiRepository().getNovedadTipoLista()
         return respuestaApiCargar
     } catch (error: any) {
        return rejectWithValue(error);
     }   
    }
)