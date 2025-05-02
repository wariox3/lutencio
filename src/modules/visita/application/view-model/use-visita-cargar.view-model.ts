import { rutasApp } from "@/constants/rutas";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { cargarOrdenThunk } from "../slice/visita.thunk";

export default function useVisitaCargarViewModel() {
  const valoresFormularioCargar = {
    codigo: "",
  };
  const { loading } = useAppSelector(({ entregas }) => entregas);

  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: valoresFormularioCargar,
  });
  const router = useRouter();
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      reset(valoresFormularioCargar);
    }, [])
  );

  const cargarOrden = async (data: FieldValues) => {
    reset({
      codigo: "",
    });
    try {
      const respuesta = await dispatch(
        cargarOrdenThunk({ codigo: data.codigo })
      ).unwrap();

      if (respuesta) {
        router.navigate(rutasApp.visitas);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { control, handleSubmit, loading, cargarOrden };
}
