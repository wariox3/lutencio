import { RootState } from "@/src/application/store/root-reducer";
import { createSelector } from "@reduxjs/toolkit";

const selectEntregas = (state: RootState) => state.entregas;

const selectFiltros = (state: RootState) => state.entregas.filtros;

export const obtenerVisitasLog = createSelector(
  [selectEntregas, selectFiltros],
  (entregas, filtros) => {
    return entregas.entregas.filter((entrega) => {
      const coincideGuia = filtros.guia ? entrega.guia === filtros.guia : true;
      const coincideNumero = filtros.numero
        ? entrega.numero === filtros.numero
        : true;
      return coincideGuia || coincideNumero;
    });
  }
);

export const obtenerEntregas = createSelector([selectEntregas], (entregas) =>
  entregas.entregas
    ? entregas.entregas
        .filter((entrega) => entrega)
        .sort((a, b) => a.orden - b.orden)
    : []
);

export const obtenerEntregasPendientesOrdenadas = createSelector(
  [selectEntregas],
  (entregas) =>
    entregas.entregas
      ? entregas.entregas
          .filter((entrega) => !entrega.estado_entregado)
          .sort((a, b) => a.orden - b.orden)
      : []
);

export const obtenerEntregasSeleccionadas = (state: RootState) =>
  state.entregas.entregasSeleccionadas;

export const selectEntregasSincronizadas = createSelector(
  [selectEntregas],
  (entregas) =>
    entregas.entregas.filter((entrega) => entrega.estado_sincronizado === true)
);

export const obtenerVisita = (visitaId: number) =>
  createSelector(
    [selectEntregas],
    (entregas) =>
      entregas.entregas.filter((visita) => visita.id === visitaId) || []
);

export const obtenerEntregasPendientes = createSelector(
  [selectEntregas],
  (entregas) => {
    return entregas.entregas.filter(
      (entrega) =>
        entrega.estado_entregado === true &&
        entrega.estado_sincronizado === false &&
        entrega.entregada_sincronizada_error === false
    );
  }
);

export const obtenerFiltroGuia = createSelector([selectFiltros], (filtros) => {
  return filtros.guia;
});

export const obtenerFiltroNumero = createSelector(
  [selectFiltros],
  (filtros) => {
    return filtros.numero;
  }
);

export const getSincronizandoEntregas = createSelector(
  [selectEntregas],
  (entregas) => {
    return entregas.sincronizando;
  }
);

export const selectVisitasConErrorTemporal = createSelector(
  [selectEntregas],
  (entregas) =>
    entregas.entregas.filter(
      (entrega) =>
        entrega.entregada_sincronizada_error &&
        entrega.entregada_sincronizada_codigo === 500
    )
);

export const selectCantidadVisitasConErrorTemporal = createSelector(
  [selectVisitasConErrorTemporal],
  (entregas) => entregas.length
);
