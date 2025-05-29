import APIS from "@/src/core/constants/endpoint.constant";
import {
  useEliminarEnGaleria,
  useGuardarEnGaleria,
} from "@/src/shared/hooks/useMediaLibrary";
import { novedadTipo } from "@/src/modules/visita/domain/interfaces/novedad-tipo.interface";
import { obtenerConfiguracionSelectorNovedadTipo } from "@/src/application/selectors/configuracion.selector";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { obtenerEntregasSeleccionadas } from "../slice/entrega.selector";
import {
  actualizarNovedad,
  agregarImagenEntrega,
  cambiarEstadoNovedad,
  cambiarEstadoSinconizado,
} from "../slice/entrega.slice";
import { visitaNovedadThunk } from "../slice/visita.thunk";

const valoresFormulario: NovedadFormType = {
  descripcion: "",
  novedad_tipo: "",
  foto: "",
};

type NovedadFormType = {
  descripcion: string;
  novedad_tipo: string;
  foto: string;
};

export default function useVisitaNovedadViewModel() {
  const { guardarArchivo } = useGuardarEnGaleria();
  const { eliminarArchivo } = useEliminarEnGaleria();
  const { control, handleSubmit, setValue } = useForm<NovedadFormType>({
    defaultValues: valoresFormulario,
  });
  const visitasSeleccionadas = useAppSelector(obtenerEntregasSeleccionadas);
  const novedadesTipo = useAppSelector(obtenerConfiguracionSelectorNovedadTipo);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const estadoInicial: {
    arrImagenes: { uri: string }[];
    arrNovedadesTipo: novedadTipo[];
    mostrarAnimacionCargando: boolean;
    ubicacionHabilitada: boolean;
    activarCamara: boolean;
    abrirGaleria: boolean;
    exigeImagenEntrega: boolean;
    inhabilitarBtnEntrega: boolean;
    camaraTipo: string;
    fotoSeleccionada: any[];
  } = {
    arrImagenes: [],
    arrNovedadesTipo: [],
    mostrarAnimacionCargando: false,
    ubicacionHabilitada: false,
    activarCamara: false,
    abrirGaleria: false,
    exigeImagenEntrega: true,
    inhabilitarBtnEntrega: false,
    camaraTipo: "",
    fotoSeleccionada: [],
  };
  const [state, setState] = useState(estadoInicial);

  const actualizarState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const handleCapture = async (uri: string) => {
    //1. guardar la foto en el celular
    const nuevaUri = await guardarArchivo(uri);
    if (!nuevaUri) {
      throw new Error("Error al guardar la imagen");
    }

    // 2. Actualizar el estado con la nueva imagen
    actualizarState({
      arrImagenes: [...state.arrImagenes, { uri: nuevaUri }], // usamos la nueva URI como ID provisional
    });

    // 3. Actualizar el valor del campo 'foto' en el formulario
    setValue("foto", nuevaUri, { shouldValidate: true });
  };

  const removerFoto = async (indexArrImagen: number) => {
    try {
      const imagen = state.arrImagenes[indexArrImagen];
      // Aquí deberías también actualizar tu estado para reflejar la eliminación
      const newArrImagenes = [...state.arrImagenes];
      newArrImagenes.splice(indexArrImagen, 1);
      // Suponiendo que tienes una función para actualizar el estado
      setState((prev) => ({ ...prev, arrImagenes: newArrImagenes }));
      setValue("foto", "", { shouldValidate: true });

      await eliminarArchivo(imagen.uri);
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
    }
  };

  const entregarNovedadOffline = async (
    data: NovedadFormType,
    visitasSeleccionadas: number[],
    state: any,
    dispatch: any,
    cambiarEntregaEstadoNovedad: () => void
  ) => {
    visitasSeleccionadas.forEach((entregaId) => {
      dispatch(
        agregarImagenEntrega({
          entregaId,
          imagen: { uri: state.arrImagenes[0].uri },
        })
      );
      dispatch(
        actualizarNovedad({
          entregaId,
          novedad_tipo: data.novedad_tipo,
          novedad_descripcion: data.descripcion,
        })
      );
    });

    cambiarEntregaEstadoNovedad();
    Alert.alert(`✅ Éxito`, "Guardado localmente por falta de red");
  };

  const entregarNovedadOnline = async (
    data: NovedadFormType,
    visitasSeleccionadas: number[],
    cambiarEntregaEstadoNovedad: () => void
  ) => {
    await Promise.all(
      visitasSeleccionadas.map(async (visita: number) => {
        dispatch(
          visitaNovedadThunk({
            visita,
            descripcion: data.descripcion,
            novedad_tipo: data.novedad_tipo,
            imagenes: state.arrImagenes,
          })
        );
      })
    );

    cambiarEntregaEstadoNovedad();
    cambiarEntregaEstadoSinconizado();
  };

  const guardarNovedad = async (data: NovedadFormType) => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const hayConexion =
        networkState.isConnected && networkState.isInternetReachable;

      actualizarState({ mostrarAnimacionCargando: true });

      if (!hayConexion) {
        await entregarNovedadOffline(
          data,
          visitasSeleccionadas,
          state,
          dispatch,
          cambiarEntregaEstadoNovedad
        );
        return;
      }

      await entregarNovedadOnline(
        data,
        visitasSeleccionadas,
        cambiarEntregaEstadoNovedad
      );
    } catch (error) {
      actualizarState({ mostrarAnimacionCargando: false });
    } finally {
      actualizarState({ mostrarAnimacionCargando: false });
      router.back();
    }
  };

  const cambiarEntregaEstadoNovedad = () => {
    visitasSeleccionadas.map((visita: number) => {
      dispatch(cambiarEstadoNovedad(visita));
    });
  };

  const cambiarEntregaEstadoSinconizado = () => {
    visitasSeleccionadas.map((visita: number) => {
      dispatch(cambiarEstadoSinconizado(visita));
    });
  };

  return {
    control,
    state,
    handleCapture,
    removerFoto,
    guardarNovedad,
    handleSubmit,
    novedadesTipo,
  };
}
