import { useAppDispatch } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import { alertas } from "@/src/core/constants/alertas.const";
import networkService from "@/src/core/services/network.service";
import storageService from "@/src/core/services/storage.service";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { actualizarNovedadSolucion, cambiarEstadoNovedadSolucion } from "../slice/entrega.slice";
import { visitaNovedadSolucionThunk } from "../slice/visita.thunk";

const valoresFormulario: NovedadSolucionFormType = {
  solucion: "",
};

type NovedadSolucionFormType = {
  solucion: string;
};

export default function useVisitaNovedadSolucionViewModel() {
  const { control, handleSubmit, setValue } = useForm<NovedadSolucionFormType>({
    defaultValues: valoresFormulario,
  });
  const { id, visita_id } = useLocalSearchParams();
  const dispatch = useAppDispatch();

  const novedad_id = Array.isArray(id) ? id[0] : id;
  const vistaId = Array.isArray(visita_id) ? visita_id[0] : visita_id;

  const estadoInicial: {
    mostrarAnimacionCargando: boolean;
  } = {
    mostrarAnimacionCargando: false,
  };
  const [state, setState] = useState(estadoInicial);
  const router = useRouter();

  const actualizarState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const NovedadSolucionOffline = async (data: NovedadSolucionFormType) => {
    dispatch(
      actualizarNovedadSolucion(
        ({
          novedad_id: parseInt(novedad_id),
          entrega_id:parseInt(vistaId),
         solucion_novedad: data.solucion,
       })
    ));
    dispatch(cambiarEstadoNovedadSolucion(parseInt(vistaId)))
    mostrarAlertHook({
      titulo: alertas.titulo.exito,
      mensaje: alertas.mensaje.guardarRegistroLocal,
    });  };

  const NovedadSolucionOnline = async (data: NovedadSolucionFormType) => {
    const subdominio = await storageService.getItem(STORAGE_KEYS.subdominio) as string;
    if (subdominio) {
      dispatch(
        visitaNovedadSolucionThunk({
          id: parseInt(novedad_id),
          solucion: data.solucion,
          visita: parseInt(vistaId),
        })
      );
    }
  };

  const guardarSolucion = async (data: NovedadSolucionFormType) => {
    try {
      const hayConexion = await networkService.validarEstadoRed();
      actualizarState({ mostrarAnimacionCargando: true });
      if (!hayConexion) {
        await NovedadSolucionOffline(data);
        return;
      }

      await NovedadSolucionOnline(data);
    } catch (error) {
      actualizarState({ mostrarAnimacionCargando: false });
    } finally {
      actualizarState({ mostrarAnimacionCargando: false });
      router.back();
    }
  };

  return {
    control,
    state,
    guardarSolucion,
    handleSubmit,
  };
}
