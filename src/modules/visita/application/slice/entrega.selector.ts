import { RootState } from "@/src/application/store/root-reducer";
import { createSelector } from "@reduxjs/toolkit";

const selectEntregas = (state: RootState) => state.entregas;

const selectFiltros = (state: RootState) => state.entregas.filtros;

export const obtenerVisitasLog = createSelector(
  [selectEntregas, selectFiltros],
  (entregas, filtros) => {
    return entregas.entregas
      .filter((entrega) => {
        const coincideGuia = filtros.guia
          ? entrega.guia === filtros.guia
          : true;
        const coincideNumero = filtros.numero
          ? entrega.numero === filtros.numero
          : true;
        return coincideGuia || coincideNumero;
      });
  }
);

export const obtenerEntregasFiltros = createSelector(
  [selectEntregas, selectFiltros],
  (entregas, filtros) => {
    return entregas.entregas
      .filter((entrega) => !entrega.estado_entregado)
      .filter((entrega) => {
        const coincideGuia = filtros.guia
          ? entrega.guia === filtros.guia
          : true;
        const coincideNumero = filtros.numero
          ? entrega.numero === filtros.numero
          : true;
        return coincideGuia || coincideNumero;
      });
  }
);

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
    if (
      !idsSeleccionados ||
      idsSeleccionados.length === 0 ||
      !entregasPendientes
    ) {
      return [];
    }

    // Convertir el array de IDs a un Set para mejor performance
    const idsSet = new Set(idsSeleccionados);

    return entregasPendientes
      .filter((entrega) => idsSet.has(entrega.id))
      .sort((a, b) => a.orden - b.orden);
  }
);

export const selectEntregasConNovedad = createSelector(
  [selectEntregas],
  (entregas) =>
    entregas.entregas.filter((entrega) => entrega.estado_novedad === true)
);

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

export const obtenerVisitaFiltroPorNumero = (numero: number) =>
  createSelector(
    [selectEntregas],
    (entregas) =>
      entregas.entregas.filter((visita) => visita.numero === numero) || []
  );

export const obtenerVisitaFiltroPorGuia = (guia: number) =>
  createSelector(
    [selectEntregas],
    (entregas) =>
      entregas.entregas.filter((visita) => visita.guia === guia) || []
  );

export const obtenerEntregasPendientes = createSelector(
  [selectEntregas],
  (entregas) => {
    return entregas.entregas.filter(
      (entrega) =>
      (entrega.estado_entregado === true &&
        entrega.estado_sincronizado === false &&
        entrega.entregada_sincronizada_error === false
      )
    )
  }
);

export const obtenerNovedadesPendientes = createSelector(
  [selectEntregas],
  (entregas) => {
    return entregas.entregas.filter(
      (entrega) =>
      (entrega.estado_novedad === true &&
        entrega.estado_sincronizado === false &&
        entrega.entregada_sincronizada_error === false)
    )
  }
);

export const comprobarFiltrosActivos = createSelector(
  [selectFiltros],
  (filtros) => {
    return filtros.guia > 0 || filtros.numero > 0;
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
