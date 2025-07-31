import { RootState } from "@/src/application/store/root-reducer";
import { createSelector } from "@reduxjs/toolkit";

export const selectNovedades = (state: RootState) => state.novedades;

export const selectAllNovedades = createSelector(
  [selectNovedades],
  (novedades) => novedades.novedades
);

export const selectNovedadesSinSincronizar = createSelector(
  [selectNovedades],
  (novedades) =>
    novedades.novedades.filter(
      (novedad) =>
        !novedad.estado_sincronizado && !novedad.estado_sincronizada_error
    )
);

export const selectSincronizandoNovedades = createSelector(
  [selectNovedades],
  (novedades) => novedades.sincronizando
);

export const selectCantidadNovedades = createSelector(
  [selectNovedades],
  (novedades) => novedades.novedades.length
);
