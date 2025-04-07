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
