import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";

import APIS from "@/constants/endpoint";
import useNetworkStatus from "@/src/shared/hooks/useNetworkStatus";
import { configuracionThunk } from "@/src/application/slices/configuracion.thunk";
import { obtenerUsuarioId } from "@/src/modules/user/application/slice/usuario.selector";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "tamagui";
import {
  obtenerEntregasPendientesOrdenadas,
  obtenerEntregasSeleccionadas,
  selectEntregasConNovedad,
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
  const isOnline = useNetworkStatus(); // <- Estado de red (boolean)

  const arrEntregasConNovedad = useAppSelector(selectEntregasConNovedad);

  useEffect(() => {
    async function getCurrentLocation() {
      const subdominio = await AsyncStorage.getItem("subdominio");

      
      if (isOnline && subdominio) {
        // Verifica si hay red antes de pedir ubicación
        alert(arrEntregasConNovedad.length)
        for (const novedad of arrEntregasConNovedad) {          
          let imagenes: { base64: string }[] = [];
          // 1️ Procesar imágenes (si existen)
          if (novedad.arrImagenes?.length > 0) {
            for (const imagen of novedad.arrImagenes) {
              const fileInfo = await FileSystem.getInfoAsync(imagen.uri);
              if (!fileInfo.exists) {
                console.warn(`⚠️ Imagen no encontrada: ${imagen.uri}`);
                continue;
              }
              const base64 = await FileSystem.readAsStringAsync(imagen.uri, {
                encoding: FileSystem.EncodingType.Base64,
              });
              imagenes.push({ base64: `data:image/jpeg;base64,${base64}` });
            }
          }

          const respuestaNovedad = await consultarApi<any>(
            APIS.ruteo.novedad,
            {
              visita: novedad.id,
              descripcion: novedad.novedad_descripcion,
              novedad_tipo: novedad.novedad_tipo,
              imagenes: {},
            },
            {
              requiereToken: true,
              subdominio,
            }
          );
          
          // 4️ Solo si la API responde OK, borrar archivos y marcar como sincronizado
          // if (novedad.arrImagenes?.length > 0) {
          //   for (const img of novedad.arrImagenes) {
          //     const fileInfo = await FileSystem.getInfoAsync(img.uri);
          //     if (fileInfo.exists) await eliminarArchivo(img.uri);
          //   }
          // }
        }
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      setPermisoLocalizacion(status);
    }

    getCurrentLocation();
  }, [navigation, isOnline]);

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
