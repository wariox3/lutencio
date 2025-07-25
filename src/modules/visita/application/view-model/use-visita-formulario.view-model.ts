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
  actualizarFechaEntrega,
  actualizarFirmaEntrega,
  agregarImagenEntrega,
  cambiarEstadoEntrega,
  cambiarEstadoSinconizado,
  cambiarEstadoSinconizadoError,
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
      if (!estaEnLinea) {
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
    entregasSeleccionadas.forEach((visitaId) => {
      state.arrImagenes.forEach((imagen) => {
        dispatch(
          agregarImagenEntrega({
            entregaId: visitaId,
            imagen: { uri: imagen.uri },
          })
        );
        if (state.firmarBase64 !== null) {
          dispatch(
            actualizarFirmaEntrega({
              entregaId: visitaId,
              firmarBase64: state.firmarBase64,
            })
          );
        }
      });
      dispatch(
        actualizarFechaEntrega({
          entregaId: visitaId,
          fecha_entrega: obtenerFechaYHoraActualFormateada(),
        })
      );
      dispatch(
        actualizarDatosAdiciones({
          entrega_id: visitaId,
          datosAdicionales: {
            recibe: data.recibe,
            recibeParentesco: data.parentesco,
            recibeNumeroIdentificacion: data.numeroIdentificacion,
            recibeCelular: data.celular,
          },
        })
      );
      dispatch(cambiarEstadoEntrega({ visitaId, nuevoEstado: true }));
      dispatch(cambiarEstadoSinconizado({ visitaId, nuevoEstado: false }));
      dispatch(cambiarEstadoSinconizadoError({ visitaId, nuevoEstado: false }));
      dispatch(quitarEntregaSeleccionada(visitaId));
    });
    mostrarAlertHook({
      titulo: alertas.titulo.exito,
      mensaje: alertas.mensaje.guardarRegistroLocal,
    });
  };

  const entregaVisitaOnline = async (data: VisitaFormType, dispatch: any) => {

    await Promise.all(
      entregasSeleccionadas.map(async (visita: number) => {
        const subdominio = (await storageService.getItem(
          STORAGE_KEYS.subdominio
        )) as string;
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

        let filefirma: any = "";
        if (state.firmarBase64) {
          filefirma = {
            uri: state.firmarBase64,
            name: "firma",
            type: "image/jpeg", // Tipo MIME por defecto
          };
        }
        formDataToSend.append(`firmas`, filefirma as any, `firma.jpg`); // Usamos 'as any' para evitar el error de tipo

        // Agregar datos adicionales como JSON
        const datosAdicionales = {
          recibe: data.recibe,
          recibeParentesco: data.parentesco,
          recibeNumeroIdentificacion: data.numeroIdentificacion,
          recibeCelular: data.celular,
        };
        formDataToSend.append(
          "datos_adicionales",
          JSON.stringify(datosAdicionales)
        );

        try {
          const respuesta = await dispatch(visitaEntregaThunk({ formData: formDataToSend, visitaId: visita })).unwrap();
        } catch (error: any) {
          const errorParseado = error as ApiErrorResponse;
          mostrarAlertHook({
            titulo: errorParseado.titulo,
            mensaje: errorParseado.mensaje,
          });
        }
      })
    );
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
