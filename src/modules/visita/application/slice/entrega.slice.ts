import { Entrega } from "@/interface/entrega/entrega";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cargarOrdenThunk } from "./visita.thunk";

interface EntregasState {
  entregas: Entrega[];
  entregasSeleccionadas: number[];
  loading: boolean;
}

const initialState: EntregasState = {
  entregas: [],
  entregasSeleccionadas: [],
  loading: false,
};

const entregasSlice = createSlice({
  name: "entregas",
  initialState,
  reducers: {
    quitarEntregas: (state) => {
      state.entregas = [];
    },
    seleccionarEntrega: (state, action: PayloadAction<number>) => {
      if (!state.entregasSeleccionadas) {
        state.entregasSeleccionadas = [];
      }
      state.entregasSeleccionadas.push(action.payload);
    },
    agregarImagenEntrega: (
      state,
      action: PayloadAction<{
        entregaId: number;
        imagen: { uri: string };
      }>
    ) => {
      const { entregaId, imagen } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entregaId);
      if (entrega) {
        // Asegurarnos que arrImagenes existe
        if (!entrega.arrImagenes) {
          entrega.arrImagenes = [];
        }
        entrega.arrImagenes.push(imagen);
      }
    },
    quitarImagenEntrega: (
      state,
      action: PayloadAction<{
        entregaId: number;
        imagenUri: string;
      }>
    ) => {
      const { entregaId, imagenUri } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entregaId);
      if (entrega && entrega.arrImagenes) {
        entrega.arrImagenes = entrega.arrImagenes.filter(
          (img) => img.uri !== imagenUri
        );
      }
    },
    actualizarFirmaEntrega: (
      state,
      action: PayloadAction<{ entregaId: number; firmarBase64: string | null }>
    ) => {
      const { entregaId, firmarBase64 } = action.payload;

      const entrega = state.entregas.find((e) => e.id === entregaId);
      if (entrega) {
        entrega.firmarBase64 = firmarBase64;
      }
    },
    cambiarEstadoSeleccionado: (state, action: PayloadAction<number>) => {
      const entrega = state.entregas.find((e) => e.id === action.payload);
      if (entrega) {
        entrega.seleccionado = !entrega.seleccionado;
      }
    },
    cambiarEstadoEntrega: (state, action: PayloadAction<number>) => {
      const entrega = state.entregas.find((e) => e.id === action.payload);
      if (entrega) {
        entrega.estado_entregado = !entrega.estado_entregado;
      }
    },
    cambiarEstadoNovedad: (state, action: PayloadAction<number>) => {
      const entrega = state.entregas.find((e) => e.id === action.payload);
      if (entrega) {
        entrega.estado_novedad = !entrega.estado_novedad;
      }
    },
    cambiarEstadoSinconizado: (state, action: PayloadAction<number>) => {
      const entrega = state.entregas.find((e) => e.id === action.payload);
      if (entrega) {
        entrega.estado_sincronizado = !entrega.estado_sincronizado;
      }
    },
    cambiarEstadoError: (state, action: PayloadAction<number>) => {
      const entrega = state.entregas.find((e) => e.id === action.payload);
      if (entrega) {
        entrega.estado_error = !entrega.estado_error;
      }
    },
    actualizarMensajeError: (
      state,
      action: PayloadAction<{ entregaId: number; mensaje: string }>
    ) => {
      const { entregaId, mensaje } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entregaId);
      if (entrega) {
        entrega.mensaje_error = mensaje;
      }
    },
    actualizarNovedad: (
      state,
      action: PayloadAction<{
        entregaId: number;
        novedad_tipo: number;
        novedad_descripcion: string;
      }>
    ) => {
      const { entregaId, novedad_tipo, novedad_descripcion } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entregaId);
      if (entrega) {
        entrega.novedad_tipo = novedad_tipo;
        entrega.novedad_descripcion = novedad_descripcion;
      }
    },
    limpiarEntregaSeleccionada: (state) => {
      state.entregasSeleccionadas = [];
    },
    quitarVisita: (state, action: PayloadAction<{ entregaId: number }>) => {
      const { entregaId } = action.payload;
      state.entregas = state.entregas.filter((e) => e.id !== entregaId);
    },
    quitarEntregaSeleccionada: (state, action: PayloadAction<number>) => {
      if (!state.entregasSeleccionadas) return;
      state.entregasSeleccionadas = state.entregasSeleccionadas.filter(
        (id) => id !== action.payload
      );
    },
    cambiarEstadoSeleccionadoATodas: (state) => {
      state.entregas = state.entregas.map((entrega) => ({
        ...entrega,
        seleccionado: false,
      }));
    },
  },

  extraReducers(builder) {
    builder.addCase(cargarOrdenThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(cargarOrdenThunk.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.entregas = payload;
    });
    builder.addCase(cargarOrdenThunk.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {
  seleccionarEntrega,
  cambiarEstadoEntrega,
  cambiarEstadoSeleccionado,
  limpiarEntregaSeleccionada,
  quitarEntregaSeleccionada,
  cambiarEstadoSinconizado,
  quitarEntregas,
  quitarVisita,
  agregarImagenEntrega,
  quitarImagenEntrega,
  actualizarFirmaEntrega,
  cambiarEstadoError,
  actualizarMensajeError,
  cambiarEstadoNovedad,
  actualizarNovedad,
  cambiarEstadoSeleccionadoATodas,
} = entregasSlice.actions;
export default entregasSlice.reducer;
