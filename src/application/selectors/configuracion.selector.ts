import { RootState } from "@/src/application/store/root-reducer";
import { createSelector } from "@reduxjs/toolkit";

const selectConfiguracion = (state: RootState) => state.configuracion;

export const obtenerConfiguracionModoPrueba = createSelector(
  [selectConfiguracion],
  (Configuracion) => Configuracion.modoPrueba
);

export const obtenerConfiguracionSelectorNovedadTipo = createSelector(
  [selectConfiguracion],
  (Configuracion) => Configuracion.selectores.novedadTipo
);
