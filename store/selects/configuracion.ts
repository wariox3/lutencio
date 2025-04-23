import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../reducers';

const selectConfiguracion = (state: RootState) => state.configuracion;

export const obtenerConfiguracionModoPrueba = createSelector(
    [selectConfiguracion],
    (Configuracion) => Configuracion.modoPrueba
  );