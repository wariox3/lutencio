import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { ApiErrorResponse } from "@/src/core/api/domain/interfaces/api.interface";
import { STORAGE_KEYS } from "@/src/core/constants";
import { alertas } from "@/src/core/constants/alertas.const";
import storageService from "@/src/core/services/storage.service";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import useFecha from "@/src/shared/hooks/useFecha";
import { useGuardarEnGaleria } from "@/src/shared/hooks/useMediaLibrary";
import useNetworkStatus from "@/src/shared/hooks/useNetworkStatus";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  actualizarDatosAdiciones,
  actualizarEntrega,
  actualizarFechaEntrega,
  actualizarFirmaEntrega,
  agregarImagenEntrega,
  cambiarEstadoEntrega,
  cambiarEstadoSincronizado,
  cambiarEstadoSincronizadoError,
  quitarEntregaSeleccionada,
} from "../slice/entrega.slice";
import { visitaEntregaThunk } from "../slice/visita.thunk";

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
  const estaEnLinea = useNetworkStatus();
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
      actualizarState({ mostrarAnimacionCargando: true });
        await guardarEntregaLocal(data, dispatch);
        return;
    } catch (error) {
      actualizarState({ mostrarAnimacionCargando: false });
    } finally {
      actualizarState({ mostrarAnimacionCargando: false });
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
        // dispatch(
        //   agregarImagenEntrega({
        //     entregaId: visitaId,
        //     imagen: { uri: imagenEntrega },  
        //   })
        // );
        // if (state.firmarBase64 !== null) {
        //   dispatch(
        //     actualizarFirmaEntrega({
        //       entregaId: visitaId,
        //       firmarBase64: state.firmarBase64,
        //     })
        //   );
        // }
      });

      // dispatch(agregarImagenEntrega({
      //   entregaId: visitaId,
      //   imagenes: imagenesEntrega,
      // }));

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
       
      // dispatch(
      //   actualizarFechaEntrega({
      //     entregaId: visitaId,
      //     fecha_entrega: obtenerFechaYHoraActualFormateada(),
      //   })
      // );
      // dispatch(
      //   actualizarDatosAdiciones({
      //     entrega_id: visitaId,
      //     datosAdicionales: {
      //       recibe: data.recibe,
      //       recibeParentesco: data.parentesco,
      //       recibeNumeroIdentificacion: data.numeroIdentificacion,
      //       recibeCelular: data.celular,
      //     },
      //   })
      // );
      dispatch(cambiarEstadoEntrega({ visitaId, nuevoEstado: true }));
      dispatch(cambiarEstadoSincronizadoError({ visitaId, nuevoEstado: false }));
      dispatch(cambiarEstadoSincronizado({ visitaId, nuevoEstado: false }));
      dispatch(quitarEntregaSeleccionada(visitaId));
    });
    // mostrarAlertHook({
    //   titulo: alertas.titulo.exito,
    //   mensaje: alertas.mensaje.guardarRegistroLocal,
    // });
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
    obtenerColor,
  };
}
