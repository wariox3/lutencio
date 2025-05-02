import { RootState } from "@/src/application/store/root-reducer";
import { createSelector } from "@reduxjs/toolkit";

const selectUsuario = (state: RootState) => state.auth;

export const obtenerUsuarioId = createSelector(
  [selectUsuario],
  (usuario) => usuario.auth?.user.id
);
