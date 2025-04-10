import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../reducers";

const selectEntregas = (state: RootState) => state.entregas;

export const obtenerEntregasPendientesOrdenadas = createSelector(
  [selectEntregas],
  (entregas) =>
    entregas.entregas
      .filter((entrega) => !entrega.estado_entregado)
      .sort((a, b) => a.orden - b.orden) || []
);

export const obtenerEntregasSeleccionadas = (state: RootState) =>
  state.entregas.entregasSeleccionadas;

export const obtenerEntregasMapa = createSelector(
  [obtenerEntregasSeleccionadas, obtenerEntregasPendientesOrdenadas],
  (idsSeleccionados, entregasPendientes) => {
    if (!idsSeleccionados || idsSeleccionados.length === 0 || !entregasPendientes) {
      return [];
    }
    
    // Convertir el array de IDs a un Set para mejor performance
    const idsSet = new Set(idsSeleccionados);
    
    return entregasPendientes.filter(entrega => 
      idsSet.has(entrega.id)
    ).sort((a, b) => a.orden - b.orden);
  }
);