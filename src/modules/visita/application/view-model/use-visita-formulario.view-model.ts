import { rutasApp } from "@/src/core/constants/rutas.constant";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  actualizarFechaEntrega,
  actualizarFirmaEntrega,
  agregarImagenEntrega,
  cambiarEstadoEntrega,
  cambiarEstadoSinconizado,
  quitarEntregaSeleccionada,
} from "../slice/entrega.slice";
import * as Network from "expo-network";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { consultarApi, consultarApiFormData } from "@/utils/api";
import APIS from "@/src/core/constants/endpoint.constant";
import { useGuardarEnGaleria } from "@/src/shared/hooks/useMediaLibrary";
import * as FileSystem from "expo-file-system";
import useFecha from "@/src/shared/hooks/useFecha";

type VisitaFormType = {
  recibe: string;
  parentesco: string;
  numeroIdentificacion: string;
  celular: string;
  fecha_entrega: string;
};

export default function useVisitaFormularioViewModel() {
  const dispatch = useAppDispatch();
  const { guardarArchivo } = useGuardarEnGaleria();
  const { obtenerFechaYHoraActualFormateada } = useFecha();
  const entregasSeleccionadas = useAppSelector(
    ({ entregas }) => entregas.entregasSeleccionadas || []
  );

  const router = useRouter();
  const { control, handleSubmit, reset, getValues } = useForm<VisitaFormType>({
    defaultValues: {
      recibe: "",
      parentesco: "",
      numeroIdentificacion: "",
      celular: "",
      fecha_entrega: obtenerFechaYHoraActualFormateada(),
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
      fecha_entrega: obtenerFechaYHoraActualFormateada()
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
        await entregaVisitaOffline(data, dispatch);
        return;
      }
      await entregaVisitaOnline(data, dispatch);
    } catch (error) {
      actualizarState({ mostrarAnimacionCargando: false });
    } finally {
      actualizarState({ mostrarAnimacionCargando: false });
      router.back();
    }
  };

  const entregaVisitaOffline = async (data: VisitaFormType, dispatch: any) => {
    
    // Agregar imágenes a entregas seleccionadas
    entregasSeleccionadas.forEach((entregaId) => {
      state.arrImagenes.forEach((imagen) => {
        dispatch(
          agregarImagenEntrega({ entregaId, imagen: { uri: imagen.uri } })
        );
        if (state.firmarBase64 !== null) {
          dispatch(
            actualizarFirmaEntrega({
              entregaId,
              firmarBase64: state.firmarBase64,
            })
          );
        }
      });
      dispatch(
        actualizarFechaEntrega({
          entregaId,
          fecha_entrega: obtenerFechaYHoraActualFormateada(),
        })
      );
      dispatch(cambiarEstadoEntrega(entregaId));
      dispatch(quitarEntregaSeleccionada(entregaId));
    });
    Alert.alert(`✅ Éxito`, "Guardado localmente por falta de red");
  };

  const entregaVisitaOnline = async (data: VisitaFormType, dispatch: any) => {    
    await Promise.all(
      entregasSeleccionadas.map(async (visita: number) => {
        const subdominio = await AsyncStorage.getItem("subdominio");
        //Usamos Promise.all para esperar a que todas las imágenes se lean
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

        const formDataToSend = new FormData();
        formDataToSend.append("id", `${visita}`);
        formDataToSend.append("fecha_entrega", data.fecha_entrega);
        state.arrImagenes.forEach((archivo, index) => {
          // Crear un objeto File-like compatible con FormData
          const file = {
            uri: archivo.uri,
            name: `image-${index}.jpg`, // Usar nombre del archivo o generar uno
            type: "image/jpeg", // Tipo MIME por defecto
          };

          // La forma correcta de adjuntar archivos en React Native
          formDataToSend.append(`imagenes`, file as any, `image-${index}.jpg`); // Usamos 'as any' para evitar el error de tipo
        });

        const respuesta = await consultarApiFormData<any>(APIS.ruteo.visitaEntrega, formDataToSend, {
          requiereToken: true,
          subdominio: subdominio!,
        });
      })
    );
    entregasSeleccionadas.forEach((entrega) => {
      dispatch(cambiarEstadoEntrega(entrega));
      dispatch(quitarEntregaSeleccionada(entrega));
    });
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
