import APIS from "@/constants/endpoint";
import { useAppDispatch } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import networkService from "@/src/core/services/network.service";
import storageService from "@/src/core/services/storage.service";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { visitaNovedadThunk } from "../slice/visita.thunk";

const valoresFormulario: SolucionNovedadFormType = {
  solucion: "",
};

type SolucionNovedadFormType = {
  solucion: string;
};

export default function useVisitaSolucionNovedadViewModel() {
  const { control, handleSubmit, setValue } = useForm<SolucionNovedadFormType>({
    defaultValues: valoresFormulario,
  });
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();

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

  const solucionNovedadOffline = async (data: SolucionNovedadFormType) => {
    // dispatch(
    //   actualizarSolucionNovedad({
    //     visitaId: id,
    //     solucion_novedad: data.solucion,
    //   })
    // );
    // Alert.alert(`✅ Éxito`, "Guardado localmente por falta de red");
  };

  const solucionNovedadOnline = async (data: SolucionNovedadFormType) => {
    const subdominio = await AsyncStorage.getItem("subdominio");
    if (subdominio) {
      await consultarApi<any>(
        APIS.ruteo.novedadSolucionar,
        {
          id,
          solucion: data.solucion,
        },
        {
          requiereToken: true,
          subdominio: subdominio as string,
        }
      );
    }
  };

  const guardarSolucion = async (data: SolucionNovedadFormType) => {
    try {
      const hayConexion = await networkService.validarEstadoRed();
      actualizarState({ mostrarAnimacionCargando: true });
      if (!hayConexion) {
        await solucionNovedadOffline(data);
        return;
      }

      await solucionNovedadOnline(data);
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
