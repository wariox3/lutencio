import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import useFecha from "@/src/shared/hooks/useFecha";
import { useGuardarEnGaleria } from "@/src/shared/hooks/useMediaLibrary";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  actualizarEntrega,
  cambiarEstadoEntrega,
  cambiarEstadoSincronizado,
  cambiarEstadoSincronizadoError,
  entregasProcesadas,
  quitarEntregaSeleccionada
} from "../slice/entrega.slice";
import { networkMonitor } from "@/src/core/services/network-monitor.service";
import { Alert } from "react-native";

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
  const [isLoading, setIsLoading] = useState(false);
  const { obtenerFechaYHoraActualFormateada } = useFecha();
  const entregasSeleccionadas = useAppSelector(
    ({ entregas }) => entregas.entregasSeleccionadas || []
  );
  const { obtenerColor } = useTemaVisual();
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<VisitaFormType>({
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
      fecha_entrega: obtenerFechaYHoraActualFormateada(),
    });
  };

  const actualizarState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const handleCapture = async (uri: string) => {
    if (!uri) {
      Alert.alert("Error", "No se recibió una imagen válida.");
      return;
    }
  
    try {
      // 1. Guardar la foto en el dispositivo
      const nuevaUri = await guardarArchivo(uri);
      if (!nuevaUri) {
        throw new Error("No se pudo guardar la imagen en el dispositivo.");
      }
  
      // 2. Actualizar el estado de forma segura (función updater)
      actualizarState({
        arrImagenes: [...state.arrImagenes, { uri: nuevaUri }],
      });
    } catch (error: any) {
      const mensaje = error?.message || "Ha ocurrido un error inesperado.";
      Alert.alert("Error", mensaje);
      console.error("handleCapture error:", error);
    }
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
      setIsLoading(true);
      guardarEntregaLocal(data, dispatch);
    } finally {
      setIsLoading(false);
      router.back();
    }
  };

  const guardarEntregaLocal = async (data: VisitaFormType, dispatch: any) => {
    // Agregar imágenes a entregas seleccionadas
    
    entregasSeleccionadas.forEach((visitaId) => {
      const imagenesEntrega: { uri: string }[] = []
      const firmaEntrega = state.firmarBase64 ? state.firmarBase64 : null
      state.arrImagenes?.forEach((imagen) => {
        imagenesEntrega.push({ uri: imagen.uri })
      });

      dispatch(actualizarEntrega({
        entregaId: visitaId,
        camposActualizados: {
          firmarBase64: firmaEntrega,
          fecha_entrega: obtenerFechaYHoraActualFormateada(),
          arrImagenes: imagenesEntrega,
          datosAdicionales: {
            recibe: data.recibe,
            recibeParentesco: data.parentesco,
            recibeNumeroIdentificacion: data.numeroIdentificacion,
            recibeCelular: data.celular,
          },
        },
      }));

      if(!networkMonitor.isConnected()){
        dispatch(cambiarEstadoSincronizadoError({ visitaId, nuevoEstado: true, codigo: 500, mensaje: "" }));
      } else {
        dispatch(cambiarEstadoSincronizadoError({ visitaId, nuevoEstado: false, codigo: 0, mensaje: "" }));
      }
       
      dispatch(cambiarEstadoSincronizado({ visitaId, nuevoEstado: false }));
      dispatch(cambiarEstadoEntrega({ visitaId, nuevoEstado: true }));
      dispatch(quitarEntregaSeleccionada(visitaId));
    });

    // notificamos que las entregas han sido procesadas
    dispatch(entregasProcesadas({ entregasIds: entregasSeleccionadas }));
  };

  return {
    control,
    entregasSeleccionadas,
    state,
    handleCapture,
    isLoading,
    handleFirma,
    removerFirma,
    handleSubmit,
    guardarEntrega,
    removerFoto,
    obtenerColor,
  };
}
