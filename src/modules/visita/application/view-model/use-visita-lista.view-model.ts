import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { obtenerUsuarioId } from "@/src/modules/user/application/slice/usuario.selector";
import { usePermisos } from "@/src/shared/hooks/usePermisos";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "tamagui";
import { Entrega } from "../../domain/interfaces/vista.interface";
import {
  obtenerEntregasPendientesOrdenadas,
  obtenerEntregasSeleccionadas
} from "../slice/entrega.selector";
import {
  cambiarEstadoSeleccionadoATodas,
  limpiarEntregaSeleccionada,
  toggleSeleccionado
} from "../slice/entrega.slice";

export default function useVisitaListaViewModel() {
  const dispatch = useAppDispatch();
  const todasLasEntregas = useAppSelector(obtenerEntregasPendientesOrdenadas);
  const usuarioId = useAppSelector(obtenerUsuarioId);
  const entregasSeleccionadas = useAppSelector(obtenerEntregasSeleccionadas);
  storageService.setItem(STORAGE_KEYS.usuarioId, `${usuarioId}`);
  const [refreshing, setRefreshing] = useState(false);
  const { validarPermisos } = usePermisos();
  const { obtenerColor } = useTemaVisual()
  const theme = useTheme();

  // Estado local para los filtros
  const [filtros, setFiltros] = useState<{ guia: number; numero: number }>({
    guia: 0,
    numero: 0,
  });
  
  // Optimización: Usar useMemo para calcular las entregas filtradas en lugar de useState + useEffect
  // Esto evita un re-render adicional y mejora el rendimiento
  const entregasFiltradas = useMemo(() => {
    if (filtros.guia === 0 && filtros.numero === 0) {
      // Si no hay filtros activos, mostrar todas las entregas
      return todasLasEntregas;
    } else {
      // Aplicar filtros con coincidencia parcial
      const valorBusqueda = filtros.guia || filtros.numero;
      const valorBusquedaStr = valorBusqueda.toString();
      
      // Aplicar filtros
      return todasLasEntregas.filter((entrega) => {
        // Convertir los valores a string para buscar coincidencias parciales
        const guiaStr = entrega.guia?.toString() || '';
        const numeroStr = entrega.numero?.toString() || '';
        
        // Buscar si el valor de búsqueda está contenido en alguno de los campos
        return guiaStr.includes(valorBusquedaStr) || numeroStr.includes(valorBusquedaStr);
      });
    }
  }, [filtros, todasLasEntregas]);

  // Optimización: Memoizar la función de actualización de filtros
  const actualizarFiltros = useCallback((nuevosFiltros: { guia: number; numero: number }) => {
    setFiltros(nuevosFiltros);
  }, []);

  // Optimización: Memoizar la función que verifica si hay filtros aplicados
  const filtrosAplicados = useCallback(() => {
    return filtros.guia > 0 || filtros.numero > 0;
  }, [filtros.guia, filtros.numero]);

  // Escucha cuando la app vuelve a primer plano (active)
  // useEffect(() => {
  //   const suscripcion = AppState.addEventListener("change", async (estado: AppStateStatus) => {
  //     if (appState.current.match(/inactive|background/) && estado === "active") {
  //       const resultado = await validarPermisos();
  //       setTienePermisos(resultado);
  //     }
  //     appState.current = estado;
  //   });

  //   return () => {
  //     suscripcion.remove();
  //   };
  // }, []);

  // solo se ejecuta cuando salen y vuelven a la vista
  useFocusEffect(
    useCallback(() => {
      gestionEntregas();
    }, [])
  );

  // Optimización: Memoizar la función para limpiar las entregas seleccionadas
  const gestionEntregas = useCallback(() => {
    dispatch(cambiarEstadoSeleccionadoATodas());
    dispatch(limpiarEntregaSeleccionada());
  }, [dispatch]);

  // limpiar unicamente una entrega o agregar
  const gestionEntrega = useCallback((id: number) => {
    // Usar la nueva función unificada toggleSeleccionado que maneja todo en una sola acción
    dispatch(toggleSeleccionado(id));
  }, [dispatch]);

  return {
    gestionEntrega,
    entregasFiltradas,
    entregasSeleccionadas,
    actualizarFiltros,
    refreshing,
    setRefreshing,
    theme,
    filtrosAplicados,
    obtenerColor,
    validarPermisos
  };
}
