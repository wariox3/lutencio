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
      action: PayloadAction<{ visitaId: number; nuevoEstado: boolean; mensaje?: string; codigo: number }>
    ) => {
      const visita = state.entregas.find(
        (e) => e.id === action.payload.visitaId
      );
      if (visita) {
        visita.entregada_sincronizada_error = action.payload.nuevoEstado;
        visita.entregada_sincronizada_codigo = action.payload.codigo;
        visita.entregada_sincronizada_error_mensaje = action.payload.mensaje || "";
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
    toggleSeleccionado: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const visita = state.entregas.find((e) => e.id === id);

      if (visita) {
        visita.seleccionado = !visita.seleccionado;


        if (visita.seleccionado) {
          // Si ahora está seleccionado, agregar a la lista
          if (!state.entregasSeleccionadas) {
            state.entregasSeleccionadas = [];
          }
          if (!state.entregasSeleccionadas.includes(id)) {
            state.entregasSeleccionadas.push(id);
          }

        } else {
          // Si ahora está deseleccionado, quitar de la lista
          if (state.entregasSeleccionadas) {
            state.entregasSeleccionadas = state.entregasSeleccionadas.filter(
              (entregaId) => entregaId !== id
            );
          }
        }
      }
    },
    eliminarEntrega: (state, action: PayloadAction<number>) => {
      const entregaId = action.payload;
      // 1. Quitar de la lista de entregas
      state.entregas = state.entregas.filter((e) => e.id !== entregaId);
      // 2. Quitar de la lista de seleccionadas si estaba
      state.entregasSeleccionadas = state.entregasSeleccionadas.filter(
        (id) => id !== entregaId
      );
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
  toggleSeleccionado,
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
  eliminarEntrega
} = entregasSlice.actions;
export default entregasSlice.reducer;
