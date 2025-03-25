import { Entrega } from "@/interface/entrega/entrega";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Definimos el tipo del estado
interface EntregasState {
  entregas: Entrega[];
  entregasSeleccionadas: number[];
}

// Estado inicial con tipado correcto
const initialState: EntregasState = {
  entregas: [],
  entregasSeleccionadas: [],
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
    quitarEntregaSeleccionada: (state, action: PayloadAction<number>) => {
      if (!state.entregasSeleccionadas) return;
      state.entregasSeleccionadas = state.entregasSeleccionadas.filter(
        (id) => id !== action.payload
      );
    },
  },
});

export const { setEntregas, seleccionarEntrega, quitarEntregaSeleccionada } =
  entregasSlice.actions;
export default entregasSlice.reducer;
