import { Entrega, EntregaGestion } from "@/interface/entrega/entrega";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Definimos el tipo del estado
interface EntregasState {
  entregas: Entrega[];
  entregasSeleccionadas: number[];
  gestion: EntregaGestion[];
}

// Estado inicial con tipado correcto
const initialState: EntregasState = {
  entregas: [],
  entregasSeleccionadas: [],
  gestion: []
};

const entregasSlice = createSlice({
  name: "entregas",
  initialState,
  reducers: {
    setEntregas: (state, action: PayloadAction<Entrega[]>) => {
      state.entregas = action.payload;
    },
    seleccionarEntrega: (state, action: PayloadAction<number>) => {
      if (!state.entregasSeleccionadas) {
        state.entregasSeleccionadas = []; // Asegurar que existe antes de modificar
      }
      state.entregasSeleccionadas.push(action.payload);
    },
    nuevaEntregaGestion: (state, action: PayloadAction<EntregaGestion>) => {
      state.gestion.push(action.payload);
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
        entrega.estado_sinconizado = !entrega.estado_sinconizado;
      }
    },
    limpiarEntregaSeleccionada: (state) => {
      state.entregasSeleccionadas = [];
    },
    quitarEntregaGestion: (state, action: PayloadAction<number>) => {
      if (!state.entregasSeleccionadas) return;
      state.gestion = state.gestion.filter((_, index) => index !== action.payload);
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
  nuevaEntregaGestion,
  cambiarEstadoSinconizado,
  quitarEntregaGestion
} = entregasSlice.actions;
export default entregasSlice.reducer;
