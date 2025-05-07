import { rutasApp } from "@/constants/rutas";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  actualizarFirmaEntrega,
  agregarImagenEntrega,
  cambiarEstadoEntrega,
  cambiarEstadoSinconizado,
  quitarEntregaSeleccionada,
} from "../slice/entrega.slice";
import * as Network from "expo-network";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { consultarApi } from "@/utils/api";
import APIS from "@/constants/endpoint";
import { useGuardarEnGaleria } from "@/hooks/useMediaLibrary";
import * as FileSystem from "expo-file-system";

type VisitaFormType = {
  recibe: string;
  parentesco: string;
  numeroIdentificacion: string;
  celular: string;
};

export default function useVisitaFormularioViewModel() {
  const dispatch = useAppDispatch();
  const { guardarArchivo } = useGuardarEnGaleria();

  const entregasSeleccionadas = useAppSelector(
    ({ entregas }) => entregas.entregasSeleccionadas || []
  );

  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<VisitaFormType>({
    defaultValues: {
      recibe: "",
      parentesco: "",
      numeroIdentificacion: "",
      celular: "",
    },
  });

  const estadoInicial: {
    arrImagenes: { uri: string }[];
    mostrarAnimacionCargando: boolean;
    ubicacionHabilitada: boolean;
    activarCamara: boolean;
    abrirGaleria: boolean;
    exigeImagenEntrega: boolean;
    exigeFirmaEntrega: boolean;
    inhabilitarBtnEntrega: boolean;
    camaraTipo: string;
    firmarBase64: string | null;
    fotoSeleccionada: any[];
  } = {
    arrImagenes: [],
    mostrarAnimacionCargando: false,
    ubicacionHabilitada: false,
    activarCamara: false,
    abrirGaleria: false,
    exigeImagenEntrega: false,
    exigeFirmaEntrega: false,
    inhabilitarBtnEntrega: false,
    camaraTipo: "",
    firmarBase64: null,
    fotoSeleccionada: [],
  };

  const [state, setState] = useState(estadoInicial);

  useEffect(() => {
    reiniciarEstadoCompleto();
  }, [entregasSeleccionadas]);

  const reiniciarEstadoCompleto = () => {
    setState(estadoInicial);
    reiniciarState();
  };

  const reiniciarState = () => {
    reset({
      recibe: "",
      parentesco: "",
      numeroIdentificacion: "",
      celular: "",
    });
  };

  const actualizarState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const handleCapture = async (uri: string) => {
    //1. guardar la foto en el celular
    const nuevaUri = await guardarArchivo(uri);
    if (!nuevaUri) {
      throw new Error("Error al guardar la imagen");
    }
    actualizarState({
      arrImagenes: [...state.arrImagenes, { uri: nuevaUri }],
    });
  };

  const handleFirma = async (firma: string) => {
    const nuevaUri = await guardarArchivo(firma);
    if (!nuevaUri) {
      throw new Error("Error al guardar la imagen");
    }
    actualizarState({
      firmarBase64: nuevaUri,
    });
  };

  const removerFoto = async (indexArrImagen: number) => {
    try {
      const imagen = state.arrImagenes[indexArrImagen];
      // Aquí deberías también actualizar tu estado para reflejar la eliminación
      const newArrImagenes = [...state.arrImagenes];
      newArrImagenes.splice(indexArrImagen, 1);
      // Suponiendo que tienes una función para actualizar el estado
      setState((prev) => ({ ...prev, arrImagenes: newArrImagenes }));
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
    }
  };

  const removerFirma = async () => {
    actualizarState({
      firmarBase64: null,
    });
  };

  const guardarEntrega = async (data: VisitaFormType) => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const hayConexion =
        networkState.isConnected && networkState.isInternetReachable;

      actualizarState({ mostrarAnimacionCargando: true });
      if (!hayConexion) {
        await entregaVisitaOffline(data, dispatch, router, rutasApp);
        return;
      }
      await entregaVisitaOnline(data, dispatch, router, rutasApp);
    } catch (error) {
      actualizarState({ mostrarAnimacionCargando: false });
    } finally {
      actualizarState({ mostrarAnimacionCargando: false });
    }
    if (state.firmarBase64 !== null) {
      const firmaGuardada = await MediaLibrary.createAssetAsync(
        state.firmarBase64
      );
      //guardar firma
      entregasSeleccionadas.map((entregaId) => {
        dispatch(
          actualizarFirmaEntrega({
            entregaId,
            firmarBase64: firmaGuardada.uri,
          })
        );
      });
    }
  };

  const entregaVisitaOffline = async (
    data: VisitaFormType,
    dispatch: any,
    router: any,
    rutasApp: any
  ) => {
    // Guardar fotos en el dispositivo
    const imagenesGuardadas = await Promise.all(
      state.arrImagenes.map(async (imagen) => {
        const asset = await MediaLibrary.createAssetAsync(imagen.uri);
        return asset.uri;
      })
    );

    if (state.firmarBase64 !== null) {
      const firmaGuardada = await MediaLibrary.createAssetAsync(
        state.firmarBase64
      );
      //guardar firma
      entregasSeleccionadas.map((entregaId) => {
        dispatch(
          actualizarFirmaEntrega({
            entregaId,
            firmarBase64: firmaGuardada.uri,
          })
        );
      });
    }

    // Agregar imágenes a entregas seleccionadas
    entregasSeleccionadas.forEach((entregaId) => {
      imagenesGuardadas.forEach((uri) => {
        dispatch(agregarImagenEntrega({ entregaId, imagen: { uri } }));
      });
    });

    // Actualizar el estado de las entregas seleccionadas
    entregasSeleccionadas.forEach((entrega) => {
      dispatch(cambiarEstadoEntrega(entrega));
      dispatch(quitarEntregaSeleccionada(entrega));
    });

    Alert.alert(`✅ Éxito`, "Guardado localmente por falta de red");
    router.navigate(rutasApp.visitas);
  };

  const entregaVisitaOnline = async (
    data: VisitaFormType,
    dispatch: any,
    router: any,
    rutasApp: any
  ) => {
    await Promise.all(
      entregasSeleccionadas.map(async (visita: number) => {
        const subdominio = await AsyncStorage.getItem("subdominio");
        // Usamos Promise.all para esperar a que todas las imágenes se lean
        const imagenes = await Promise.all(
          state.arrImagenes.map(async (imagen) => {
            const base64 = await FileSystem.readAsStringAsync(imagen.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            return { base64: `data:image/jpeg;base64,${base64}` };
          })
        );

        let firmaBase64 = null;
        if (state.firmarBase64 !== null) {
          firmaBase64 = await FileSystem.readAsStringAsync(state.firmarBase64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          firmaBase64 = `data:image/jpeg;base64,${firmaBase64}`;
        }

        await consultarApi<any>(
          APIS.ruteo.visitaEntrega,
          { ...data, id: visita, imagenes, firma: firmaBase64 },
          {
            requiereToken: true,
            subdominio: subdominio!,
          }
        );
      })
    );
    entregasSeleccionadas.forEach((entrega) => {
      dispatch(cambiarEstadoEntrega(entrega));
      dispatch(quitarEntregaSeleccionada(entrega));
    });
    router.navigate(rutasApp.visitas);
  };

  return {
    control,
    entregasSeleccionadas,
    state,
    handleCapture,
    handleFirma,
    removerFirma,
    handleSubmit,
    guardarEntrega,
    removerFoto,
  };
}
