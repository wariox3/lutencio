import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Novedad } from "../../domain/novedad.interface";

interface NovedadState {
  novedades: Novedad[];
  sincronizando: boolean;
}

const initialState: NovedadState = {
  novedades: [],
  sincronizando: false,
};

const novedadSlice = createSlice({
  name: "novedades",
  initialState,
  reducers: {
    cleanNovedades: (state) => {
      state.novedades = [];
    },
    addNovedad: (state, action: PayloadAction<Novedad>) => {
      console.log("guardando novedad local", action.payload);
      state.novedades.push(action.payload);
      console.log("novedades", state.novedades);
    },
    changeEstadoSincronizado: (
      state,
      action: PayloadAction<{ id: string; nuevoEstado: boolean }>
    ) => {
      state.novedades = state.novedades.map((novedad) => {
        if (novedad.id === action.payload.id) {
          return {
            ...novedad,
            estado_sincronizado: action.payload.nuevoEstado,
          };
        }
        return novedad;
      });
    },
    changeSincronizandoNovedades: (state, action: PayloadAction<boolean>) => {
      state.sincronizando = action.payload;
    },
    changeEstadoSincronizadoError: (
      state,
      action: PayloadAction<{ id: string; nuevoEstado: boolean; mensaje?: string }>
    ) => {
      state.novedades = state.novedades.map((novedad) => {
        if (novedad.id === action.payload.id) {
          return {
            ...novedad,
            estado_sincronizada_error: action.payload.nuevoEstado,
            estado_sincronizada_error_mensaje: action.payload.mensaje || "",
          };
        }
        return novedad;
      });
    },
    finishedSavingProcessNovedades: (
      _,
      action: PayloadAction<{
        novedadesIds: number[];
      }>
    ) => {
      console.log(`Procesadas ${action.payload.novedadesIds.length} novedades`);
    },
  },
});

export const {
  addNovedad,
  cleanNovedades,
  finishedSavingProcessNovedades,
  changeEstadoSincronizado,
  changeEstadoSincronizadoError,
  changeSincronizandoNovedades,
} = novedadSlice.actions;
export default novedadSlice.reducer;
