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

export default function useVisitaListaViewModel() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const arrEntregas = useAppSelector(obtenerEntregasFiltros);
  const usuarioId = useAppSelector(obtenerUsuarioId);
  const filtrosAplicados = useAppSelector(comprobarFiltrosActivos)
  const entregasSeleccionadas = useAppSelector(obtenerEntregasSeleccionadas);
  storageService.setItem(STORAGE_KEYS.usuarioId, `${usuarioId}`);
  const [refreshing, setRefreshing] = useState(false);
  const [tienePermisos, setTienePermisos] = useState<boolean | null>(null);
  const { validarPermisos } = usePermisos();
  const { obtenerColor } = useTemaVisual()
  const theme = useTheme();
  const appState = useRef(AppState.currentState);

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

  const recargarOrdenEntrega = async () => {
    return arrEntregas
  };

  return {
    gestionEntrega,
    arrEntregas,
    tienePermisos,
    entregasSeleccionadas,
    refreshing,
    setRefreshing,
    recargarOrdenEntrega,
    theme,
    filtrosAplicados,
    obtenerColor,
    validarPermisos
  };
}
