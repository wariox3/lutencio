import APIS from "@/src/core/constants/endpoint.constant";
import { useAppDispatch } from "@/src/application/store/hooks";
import networkService from "@/src/core/services/network.service";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { visitaNovedadSolucionThunk } from "../slice/visita.thunk";
import { Alert } from "react-native";
import { actualizarNovedadSolucion, cambiarEstadoNovedadSolucion } from "../slice/entrega.slice";

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
    Alert.alert(`✅ Éxito`, "Guardado localmente por falta de red");
  };

  const NovedadSolucionOnline = async (data: NovedadSolucionFormType) => {
    const subdominio = await AsyncStorage.getItem("subdominio");
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
