import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { obtenerUsuarioId } from "@/src/modules/user/application/slice/usuario.selector";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import * as Location from "expo-location";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "tamagui";
import {
  comprobarFiltrosActivos,
  obtenerEntregasFiltros,
  obtenerEntregasPendientesOrdenadas,
  obtenerEntregasSeleccionadas
} from "../slice/entrega.selector";
import {
  cambiarEstadoSeleccionado,
  cambiarEstadoSeleccionadoATodas,
  limpiarEntregaSeleccionada,
  quitarEntregaSeleccionada,
  seleccionarEntrega,
} from "../slice/entrega.slice";
import { usePermisos } from "@/src/shared/hooks/usePermisos";
import { AppState, AppStateStatus } from "react-native";
import { Entrega } from "../../domain/interfaces/vista.interface";

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
  
  // Estado derivado para las entregas filtradas
  const [entregasFiltradas, setEntregasFiltradas] = useState<Entrega[]>(todasLasEntregas);

  // Actualizar las entregas filtradas cuando cambien los filtros o las entregas
  useEffect(() => {
    if (filtros.guia === 0 && filtros.numero === 0) {
      // Si no hay filtros activos, mostrar todas las entregas
      setEntregasFiltradas(todasLasEntregas);
    } else {
      // Aplicar filtros con coincidencia parcial
      const valorBusqueda = filtros.guia || filtros.numero;
      const valorBusquedaStr = valorBusqueda.toString();
      // Aplicar filtros
      const filtradas = todasLasEntregas.filter((entrega) => {
        // Convertir los valores a string para buscar coincidencias parciales
        const guiaStr = entrega.guia?.toString() || '';
        const numeroStr = entrega.numero?.toString() || '';
        
        // Buscar si el valor de búsqueda está contenido en alguno de los campos
        const coincideGuia = guiaStr.includes(valorBusquedaStr);
        const coincideNumero = numeroStr.includes(valorBusquedaStr);
        
        return coincideGuia || coincideNumero;
      });
      setEntregasFiltradas(filtradas);
    }
  }, [filtros, todasLasEntregas]);

  const actualizarFiltros = (nuevosFiltros: { guia: number; numero: number }) => {
    setFiltros(nuevosFiltros);
  };

  const filtrosAplicados = () => {
    return filtros.guia > 0 || filtros.numero > 0;
  };

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

  // limpiar las entregas seleccionadas
  const gestionEntregas = () => {
    dispatch(cambiarEstadoSeleccionadoATodas());
    dispatch(limpiarEntregaSeleccionada());
  };

  // limpiar unicamente una entrega o agregar
  const gestionEntrega = (id: number) => {
    if (entregasSeleccionadas.includes(id)) {
      dispatch(quitarEntregaSeleccionada(id));
      dispatch(cambiarEstadoSeleccionado(id));
    } else {
      dispatch(seleccionarEntrega(id));
      dispatch(cambiarEstadoSeleccionado(id));
    }
  };

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
