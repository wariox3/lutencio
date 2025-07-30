import { obtenerConfiguracionSelectorNovedadTipo } from "@/src/application/selectors/configuracion.selector";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { NovedadTipo } from "@/src/modules/visita/domain/interfaces/novedad-tipo.interface";
import useFecha from "@/src/shared/hooks/useFecha";
import {
  useEliminarEnGaleria,
  useGuardarEnGaleria,
} from "@/src/shared/hooks/useMediaLibrary";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { obtenerEntregasSeleccionadas } from "../slice/entrega.selector";
import {
  actualizarNovedad,
  cambiarEstadoNovedad,
  cambiarEstadoSincronizado,
  novedadesProcesadas,
} from "../slice/entrega.slice";

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
  const { obtenerFechaYHoraActualFormateada } = useFecha();

  const { control, handleSubmit, setValue } = useForm<NovedadFormType>({
    defaultValues: valoresFormulario,
  });
  const visitasSeleccionadas = useAppSelector(obtenerEntregasSeleccionadas);
  const novedadesTipo = useAppSelector(obtenerConfiguracionSelectorNovedadTipo);
  const { obtenerColor } = useTemaVisual();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const estadoInicial: {
    arrImagenes: { uri: string }[];
    arrNovedadesTipo: NovedadTipo[];
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

  const guardarNovedadLocal = async (
    data: NovedadFormType,
    visitasSeleccionadas: number[],
  ) => {
    visitasSeleccionadas.forEach((id) => {
      dispatch(
        actualizarNovedad({
          entregaId: id,
          camposActualizados: {
            arrImagenes: [{ uri: state.arrImagenes[0].uri }],
            novedad_tipo: data.novedad_tipo,
            novedad_descripcion: data.descripcion,
            fecha_entrega: obtenerFechaYHoraActualFormateada(),
          },
        })
      );

      dispatch(cambiarEstadoNovedad({ entregaId: id, nuevoEstado: true }));
      dispatch(cambiarEstadoSincronizado({ visitaId: id, nuevoEstado: false }));
    });
    
    dispatch(novedadesProcesadas({ novedadesIds: visitasSeleccionadas }));
  };

  // const entregarNovedadOnline = async (
  //   data: NovedadFormType,
  //   visitasSeleccionadas: number[],
  //   cambiarEntregaEstadoNovedad: () => void
  // ) => {
  //   await Promise.all(
  //     visitasSeleccionadas.map(async (visita: number) => {
  //       dispatch(
  //         visitaNovedadThunk({
  //           visita,
  //           descripcion: data.descripcion,
  //           novedad_tipo: data.novedad_tipo,
  //           imagenes: state.arrImagenes,
  //           fecha_entrega: obtenerFechaYHoraActualFormateada(),
  //         })
  //       );
  //     })
  //   );

  //   cambiarEntregaEstadoNovedad();
  //   cambiarEntregaEstadoSinconizado();
  // };

  const guardarNovedad = async (data: NovedadFormType) => {
    try {
      actualizarState({ mostrarAnimacionCargando: true });
      guardarNovedadLocal(data, visitasSeleccionadas);
    } catch (error) {
    } finally {
      actualizarState({ mostrarAnimacionCargando: false });
      router.back();
    }
  };

  return {
    control,
    state,
    handleCapture,
    removerFoto,
    guardarNovedad,
    handleSubmit,
    novedadesTipo,
    obtenerColor,
  };
}
