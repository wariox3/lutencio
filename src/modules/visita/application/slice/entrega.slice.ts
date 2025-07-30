import {
  DatosAdicionalesVisita,
  Entrega,
} from "@/src/modules/visita/domain/interfaces/vista.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  cargarOrdenThunk,
  visitaEntregaThunk,
  visitaNovedadSolucionThunk,
  visitaNovedadThunk,
} from "./visita.thunk";

interface EntregasState {
  entregas: Entrega[];
  entregasSeleccionadas: number[];
  sincronizando: boolean;
  loading: boolean;
  filtros: {
    guia: number;
    numero: number;
  };
}

const initialState: EntregasState = {
  entregas: [],
  entregasSeleccionadas: [],
  sincronizando: false,
  loading: false,
  filtros: {
    guia: 0,
    numero: 0,
  },
};

const entregasSlice = createSlice({
  name: "entregas",
  initialState,
  reducers: {
    quitarEntregas: (state) => {
      state.entregas = [];
    },
    seleccionarEntrega: (state, action: PayloadAction<number>) => {
      if (!state.entregasSeleccionadas) {
        state.entregasSeleccionadas = [];
      }
      state.entregasSeleccionadas.push(action.payload);
    },
    agregarImagenEntrega: (
      state,
      action: PayloadAction<{
        entregaId: number;
        imagenes: { uri: string }[];
      }>
    ) => {
      const { entregaId, imagenes } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entregaId);

      if (entrega) {
        if (!entrega.arrImagenes) {
          entrega.arrImagenes = [];
        }

        entrega.arrImagenes.push(...imagenes);
        console.log("entrega al agregar imagen", JSON.stringify(entrega));
      }
    },
    setSincronizandoEntregas: (state, action: PayloadAction<boolean>) => {
      state.sincronizando = action.payload;
    },
    quitarImagenEntrega: (
      state,
      action: PayloadAction<{
        entregaId: number;
        imagenUri: string;
      }>
    ) => {
      const { entregaId, imagenUri } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entregaId);
      if (entrega && entrega.arrImagenes) {
        entrega.arrImagenes = entrega.arrImagenes.filter(
          (img) => img.uri !== imagenUri
        );
      }
    },
    actualizarEntrega: (
      state,
      action: PayloadAction<{ entregaId: number; camposActualizados: Partial<Entrega> }>
    ) => {
      const { entregaId, camposActualizados } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entregaId);
      if (entrega) {
        Object.assign(entrega, camposActualizados);
      }
    },
    actualizarFirmaEntrega: (
      state,
      action: PayloadAction<{ entregaId: number; firmarBase64: string | null }>
    ) => {
      const { entregaId, firmarBase64 } = action.payload;

      const entrega = state.entregas.find((e) => e.id === entregaId);
      if (entrega) {
        entrega.firmarBase64 = firmarBase64;
      }
    },
    actualizarFechaEntrega: (
      state,
      action: PayloadAction<{ entregaId: number; fecha_entrega: string }>
    ) => {
      const { entregaId, fecha_entrega } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entregaId);
      if (entrega) {
        entrega.fecha_entrega = fecha_entrega;
      }
    },
    cambiarEstadoSeleccionado: (state, action: PayloadAction<number>) => {
      const entrega = state.entregas.find((e) => e.id === action.payload);
      if (entrega) {
        entrega.seleccionado = !entrega.seleccionado;
      }
    },
    cambiarEstadoEntrega: (
      state,
      action: PayloadAction<{ visitaId: number; nuevoEstado: boolean }>
    ) => {
      const visita = state.entregas.find(
        (e) => e.id === action.payload.visitaId
      );
      if (visita) {
        visita.estado_entregado = action.payload.nuevoEstado;
      }
    },
    cambiarEstadoSincronizadoError: (
      state,
      action: PayloadAction<{ visitaId: number; nuevoEstado: boolean; mensaje?: string }>
    ) => {
      const visita = state.entregas.find(
        (e) => e.id === action.payload.visitaId
      );
      if (visita) {
        visita.entregada_sincronizada_error = action.payload.nuevoEstado;
        visita.entregada_sincronizada_error_mensaje = action.payload.mensaje || "";
      }
    },
    cambiarEstadoNovedadError: (
      state,
      action: PayloadAction<{ entregaId: number; nuevoEstado: boolean; mensaje?: string }>
    ) => {
      const entrega = state.entregas.find((e) => e.id === action.payload.entregaId);
      if (entrega) {
        entrega.novedad_sincronizada_error = action.payload.nuevoEstado;
        entrega.novedad_sincronizada_error_mensaje = action.payload.mensaje || "";
      }
    },
    cambiarEstadoNovedad: (state, action: PayloadAction<{ entregaId: number; nuevoEstado: boolean }>) => {
      const entrega = state.entregas.find((e) => e.id === action.payload.entregaId);
      if (entrega) {
        entrega.estado_novedad = action.payload.nuevoEstado;
      }
    },
    cambiarEstadoSincronizado: (state, action: PayloadAction<{ visitaId: number; nuevoEstado: boolean }>) => {
      const visita = state.entregas.find(
        (e) => e.id === action.payload.visitaId
      );
      if (visita) {
        visita.estado_sincronizado = action.payload.nuevoEstado;
      }
    },
    cambiarEstadoError: (state, action: PayloadAction<number>) => {
      const entrega = state.entregas.find((e) => e.id === action.payload);
      if (entrega) {
        entrega.estado_error = !entrega.estado_error;
      }
    },
    cambiarEstadoNovedadSolucion: (state, action: PayloadAction<number>) => {
      const entrega = state.entregas.find((e) => e.id === action.payload);
      if (entrega) {
        entrega.estado_novedad_solucion = !entrega.estado_novedad_solucion;
      }
    },
    actualizarNovedadId: (
      state,
      action: PayloadAction<{ visita: number; novedad_id: number }>
    ) => {
      const entrega = state.entregas.find(
        (e) => e.id === action.payload.visita
      );
      if (entrega) {
        entrega.novedad_id = action.payload.novedad_id;
      }
    },
    actualizarMensajeError: (
      state,
      action: PayloadAction<{ entregaId: number; mensaje: string }>
    ) => {
      const { entregaId, mensaje } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entregaId);
      if (entrega) {
        entrega.mensaje_error = mensaje;
      }
    },
    actualizarNovedad: (
      state,
      action: PayloadAction<{ entregaId: number; camposActualizados: Partial<Entrega> }>
    ) => {
      const { entregaId, camposActualizados } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entregaId);
      if (entrega) {
        Object.assign(entrega, camposActualizados);
      }
    },
    actualizarNovedadSolucion: (
      state,
      action: PayloadAction<{
        entrega_id: number;
        novedad_id: number;
        solucion_novedad: string;
      }>
    ) => {
      const { entrega_id, novedad_id, solucion_novedad } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entrega_id);
      if (entrega) {
        entrega.novedad_id = novedad_id;
        entrega.solucion_novedad = solucion_novedad;
      }
    },
    limpiarEntregaSeleccionada: (state) => {
      state.entregasSeleccionadas = [];
    },
    quitarVisita: (state, action: PayloadAction<{ entregaId: number }>) => {
      const { entregaId } = action.payload;
      state.entregas = state.entregas.filter((e) => e.id !== entregaId);
    },
    quitarEntregaSeleccionada: (state, action: PayloadAction<number>) => {
      if (!state.entregasSeleccionadas) return;
      state.entregasSeleccionadas = state.entregasSeleccionadas.filter(
        (id) => id !== action.payload
      );
    },
    cambiarEstadoSeleccionadoATodas: (state) => {
      state.entregas = state.entregas.map((entrega) => ({
        ...entrega,
        seleccionado: false,
      }));
    },
    actualizarFiltros: (
      state,
      action: PayloadAction<{ guia: number; numero: number }>
    ) => {
      state.filtros = action.payload;
    },
    quitarFiltros: (state) => {
      state.filtros = {
        guia: 0,
        numero: 0,
      };
    },
    actualizarDatosAdiciones: (
      state,
      action: PayloadAction<{
        entrega_id: number;
        datosAdicionales: DatosAdicionalesVisita;
      }>
    ) => {
      const { entrega_id, datosAdicionales } = action.payload;
      const entrega = state.entregas.find((e) => e.id === entrega_id);
      if (entrega) {
        entrega.datosAdicionales = datosAdicionales;
      }
    },
    entregasProcesadas: (
      state,
      action: PayloadAction<{
        entregasIds: number[];
      }>
    ) => {
      console.log(`Procesadas ${action.payload.entregasIds.length} entregas`);
    },
    novedadesProcesadas: (
      state,
      action: PayloadAction<{
        novedadesIds: number[];
      }>
    ) => {
      console.log(`Procesadas ${action.payload.novedadesIds.length} novedades`);
    },
  },

  extraReducers(builder) {
    builder.addCase(cargarOrdenThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(cargarOrdenThunk.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.entregas = payload;
    });
    builder.addCase(cargarOrdenThunk.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(visitaNovedadThunk.fulfilled, (state, { payload }) => {
      const entrega = state.entregas.find((e) => e.id === payload.visita);
      if (entrega) {
        entrega.novedad_id = payload.id;
        entrega.estado_novedad = true;
      }
    });
    builder.addCase(
      visitaNovedadSolucionThunk.fulfilled,
      (state, { payload }) => {
        const entrega = state.entregas.find((e) => e.id === payload.visita);
        if (entrega) {
          entrega.estado_novedad_solucion = !entrega.estado_novedad_solucion;
        }
      }
    );
    builder.addCase(
      visitaEntregaThunk.fulfilled, (state, {
        payload
      }) => {
      const entrega = state.entregas.find((e) => e.id === payload.visita);
      if (entrega) {
        entrega.estado_entregado = true;
        entrega.estado_sincronizado = true;
        state.entregasSeleccionadas = state.entregasSeleccionadas.filter(
          (id) => id !== payload.visita
        );
      }
    }
    )
  },
});

export const {
  seleccionarEntrega,
  cambiarEstadoEntrega,
  cambiarEstadoSeleccionado,
  limpiarEntregaSeleccionada,
  quitarEntregaSeleccionada,
  cambiarEstadoSincronizado,
  quitarEntregas,
  quitarVisita,
  agregarImagenEntrega,
  quitarImagenEntrega,
  actualizarFirmaEntrega,
  cambiarEstadoError,
  actualizarMensajeError,
  cambiarEstadoNovedad,
  actualizarNovedad,
  actualizarNovedadId,
  cambiarEstadoSeleccionadoATodas,
  actualizarNovedadSolucion,
  cambiarEstadoNovedadSolucion,
  actualizarFechaEntrega,
  actualizarFiltros,
  quitarFiltros,
  actualizarDatosAdiciones,
  cambiarEstadoSincronizadoError,
  actualizarEntrega,
  setSincronizandoEntregas,
  entregasProcesadas,
  cambiarEstadoNovedadError,
  novedadesProcesadas,
} = entregasSlice.actions;
export default entregasSlice.reducer;
