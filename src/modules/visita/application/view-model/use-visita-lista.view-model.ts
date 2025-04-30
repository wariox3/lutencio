import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import {
  cambiarEstadoSeleccionado,
  cambiarEstadoSeleccionadoATodas,
  limpiarEntregaSeleccionada,
  quitarEntregaSeleccionada,
  seleccionarEntrega,
} from "@/store/reducers/entregaReducer";
import {
  obtenerEntregasPendientesOrdenadas,
  obtenerEntregasSeleccionadas,
} from "@/store/selects/entrega";
import { obtenerUsuarioId } from "@/store/selects/usuario";
import * as Location from "expo-location";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function useVisitaListaViewModel() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const arrEntregas = useSelector(obtenerEntregasPendientesOrdenadas);
  const usuarioId = useSelector(obtenerUsuarioId);
  const entregasSeleccionadas = useSelector(obtenerEntregasSeleccionadas);
  storageService.setItem(STORAGE_KEYS.usuarioId, `${usuarioId}`);

  const [permisoLocalizacion, setPermisoLocalizacion] = useState<string | null>(
    null
  );


  useFocusEffect(
    useCallback(() => {
      gestionEntregas();
    }, [])
  );

  const gestionEntregas = () => {
    dispatch(cambiarEstadoSeleccionadoATodas());
    dispatch(limpiarEntregaSeleccionada());
  };

  const gestionEntrega = (id: number) => {
    if (entregasSeleccionadas.includes(id)) {
      dispatch(quitarEntregaSeleccionada(id));
      dispatch(cambiarEstadoSeleccionado(id));
    } else {
      dispatch(seleccionarEntrega(id));
      dispatch(cambiarEstadoSeleccionado(id));
    }
  };

  return { gestionEntrega, arrEntregas, permisoLocalizacion, entregasSeleccionadas };
}
