import { Entrega } from "@/interface/entrega/entrega";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EntregasState {
  entregas: Entrega[];
  entregasSeleccionadas: number[];
}

const initialState: EntregasState = {
  entregas: [],
  entregasSeleccionadas: [],
};

const entregasSlice = createSlice({
  name: "entregas",
  initialState,
  reducers: {
    setEntregas: (state, action: PayloadAction<Entrega[]>) => {
      state.entregas = action.payload.map((entrega) => ({
        ...entrega,
        estado_entregado: false,  // Valor inicial por defecto
        estado_sincronizado: false,  // Valor inicial por defecto
        estado_error: false,
        mensaje_error: ''
      }));
    },
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
    actualizarMensajeError: (state, action: PayloadAction<{entregaId: number; mensaje: string}>) => {
      const { entregaId, mensaje } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entregaId);
      if (entrega) {
        entrega.mensaje_error = mensaje;
      }
    },
    limpiarEntregaSeleccionada: (state) => {
      state.entregasSeleccionadas = [];
    },
    quitarEntregaSeleccionada: (state, action: PayloadAction<number>) => {
      if (!state.entregasSeleccionadas) return;
      state.entregasSeleccionadas = state.entregasSeleccionadas.filter(
        (id) => id !== action.payload
      );
    },
  },
});

export const {
  setEntregas,
  seleccionarEntrega,
  cambiarEstadoEntrega,
  cambiarEstadoSeleccionado,
  limpiarEntregaSeleccionada,
  quitarEntregaSeleccionada,
  cambiarEstadoSinconizado,
  quitarEntregas,
  agregarImagenEntrega,
  quitarImagenEntrega,
  actualizarFirmaEntrega,
  cambiarEstadoError,
  actualizarMensajeError
} = entregasSlice.actions;
export default entregasSlice.reducer;
