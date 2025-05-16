import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";

import { configuracionThunk } from "@/src/application/slices/configuracion.thunk";
import { obtenerUsuarioId } from "@/src/modules/user/application/slice/usuario.selector";
import * as Location from "expo-location";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "tamagui";
import { useSincronizacionNovedades } from "../hooks/useSincronizacionNovedades";
import {
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
import { cargarOrdenThunk } from "../slice/visita.thunk";

export default function useVisitaListaViewModel() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const arrEntregas = useAppSelector(obtenerEntregasPendientesOrdenadas);
  const usuarioId = useAppSelector(obtenerUsuarioId);
  const entregasSeleccionadas = useAppSelector(obtenerEntregasSeleccionadas);
  storageService.setItem(STORAGE_KEYS.usuarioId, `${usuarioId}`);
  const [refreshing, setRefreshing] = useState(false);
  const [permisoLocalizacion, setPermisoLocalizacion] = useState<string | null>(
    null
  );
  const theme = useTheme();
  useSincronizacionNovedades();

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setPermisoLocalizacion(status);
    }

    getCurrentLocation();
  }, [navigation]);

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
    try {
      const codigoOrdenEntrega = await storageService.getItem(
        STORAGE_KEYS.ordenEntrega
      );
      if (codigoOrdenEntrega) {
        const respuesta = await dispatch(
          cargarOrdenThunk({ codigo: codigoOrdenEntrega as string })
        ).unwrap();

        await dispatch(configuracionThunk()).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    gestionEntrega,
    arrEntregas,
    permisoLocalizacion,
    entregasSeleccionadas,
    refreshing,
    setRefreshing,
    recargarOrdenEntrega,
    theme,
  };
}
