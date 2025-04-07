import { Usuario } from './../../interface/usuario/usuario';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../reducers';

const selectUsuario = (state: RootState) => state.usuario;

export const obtenerUsuarioId = createSelector(
    [selectUsuario],
    (Usuario) => Usuario.id
  );