import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { obtenerUsuarioId } from "@/src/modules/user/application/slice/usuario.selector";
import { usePermisos } from "@/src/shared/hooks/usePermisos";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTheme } from "tamagui";
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
  const { obtenerColor } = useTemaVisual();
  const theme = useTheme();

  // Estado local para los filtros
  const [filtro, setFiltro] = useState<string>("");

  // Optimización: Usar useMemo para calcular las entregas filtradas en lugar de useState + useEffect
  // Esto evita un re-render adicional y mejora el rendimiento
  const entregasFiltradas = useMemo(() => {
    if (filtro === "") {
      // Si no hay filtros activos, mostrar todas las entregas
      return todasLasEntregas;
    } else {
      // Aplicar filtros con coincidencia exacta
      return todasLasEntregas.filter((entrega) => {
        // Comparar valores exactos
        const coincideDocumento = filtro !== "" && entrega.documento === filtro;
        const coincideNumero = filtro !== "" && entrega.numero === Number(filtro);

        // Retornar true si coincide exactamente con alguno de los filtros activos
        return coincideDocumento || coincideNumero;
      });
    }
  }, [filtro, todasLasEntregas]);

  // Optimización: Memoizar la función de actualización de filtros
  const actualizarFiltros = useCallback(
    (valor: string) => {
      setFiltro(valor);
    },
    []
  );

  // Optimización: Memoizar la función que verifica si hay filtros aplicados
  const filtrosAplicados = useCallback(() => {
    return filtro !== "";
  }, [filtro]);

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
  const gestionEntrega = useCallback(
    (id: number) => {
      // Usar la nueva función unificada toggleSeleccionado que maneja todo en una sola acción
      dispatch(toggleSeleccionado(id));
    },
    [dispatch]
  );

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
    validarPermisos,
  };
}
