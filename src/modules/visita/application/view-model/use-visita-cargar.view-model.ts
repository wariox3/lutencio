import { configuracionThunk } from "@/src/application/slices/configuracion.thunk";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Keyboard } from "react-native";
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
    Keyboard.dismiss()
    reset({
      codigo: "",
    });
    try {
      const respuesta = await dispatch(
        cargarOrdenThunk({ codigo: data.codigo })
      ).unwrap();

      await dispatch(
        configuracionThunk()
      ).unwrap()
      if (respuesta) {
        router.navigate(rutasApp.visitas);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { control, handleSubmit, loading, cargarOrden };
}
