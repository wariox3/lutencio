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

export const selectNovedadesConErrorTemporal = createSelector(
  [selectNovedades],
  (novedades) =>
    novedades.novedades.filter(
      (novedad) => novedad.estado_sincronizada_error && novedad.estado_sincronizado_codigo === 500
    )
);

export const selectCantidadNovedadesConErrorTemporal = createSelector(
  [selectNovedadesConErrorTemporal],
  (novedades) => novedades.length
);

export const selectSincronizandoNovedades = createSelector(
  [selectNovedades],
  (novedades) => novedades.sincronizando
);

export const selectCantidadNovedades = createSelector(
  [selectNovedades],
  (novedades) => novedades.novedades.length
);
