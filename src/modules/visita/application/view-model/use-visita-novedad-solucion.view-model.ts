import { useAppDispatch } from "@/src/application/store/hooks";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { cambiarEstadoNovedad } from "../slice/entrega.slice";

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
  const { obtenerColor } = useTemaVisual();

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


  const guardarSolucion = async (data: NovedadSolucionFormType) => {
    dispatch(
      cambiarEstadoNovedad({
        entregaId: parseInt(vistaId),
        nuevoEstado: false,
      })
    );
    router.back();
  };

  return {
    control,
    state,
    guardarSolucion,
    handleSubmit,
    obtenerColor
  };
}
