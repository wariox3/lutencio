import { rutasApp } from "@/constants/rutas";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  actualizarFirmaEntrega,
  agregarImagenEntrega,
  cambiarEstadoEntrega,
  quitarEntregaSeleccionada,
} from "../slice/entrega.slice";

type VisitaFormType = {
  recibe: string;
  parentesco: string;
  numeroIdentificacion: string;
  celular: string;
};

export default function useVisitaFormularioViewModel() {
  const dispatch = useAppDispatch();
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

  const handleCapture = (uri: string) => {
    actualizarState({
      arrImagenes: [...state.arrImagenes, { uri }],
    });
  };

  const handleFirma = (firma: string) => {
    actualizarState({
      firmarBase64: firma,
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

      // Navegar a la pantalla de entrega
      router.navigate(rutasApp.visitas);
    } catch (error) {
      console.error("Error en onLoginPressed:", error);
    } finally {
      actualizarState({ mostrarAnimacionCargando: false });
    }
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
