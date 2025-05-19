import { RootState } from "@/src/application/store/root-reducer";
import { createSelector } from "@reduxjs/toolkit";

const selectConfiguracion = (state: RootState) => state.auth;

export const obtenerAuth = createSelector(
  [selectConfiguracion],
  (Configuracion) => Configuracion.auth
);