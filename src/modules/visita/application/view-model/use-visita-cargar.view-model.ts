import { rutasApp } from "@/constants/rutas";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { cargarOrdenThunk } from "../slice/visita.thunk";
import { configuracionThunk } from "@/src/application/slices/configuracion.thunk";
import { Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { consultarApi } from "@/utils/api";
import APIS from "@/constants/endpoint";
import axios from "axios";
import { iniciarTareaSeguimientoUbicacion } from "@/utils/services/locationService";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { respuestaCargar } from "../../domain/interfaces/cargar.interfase";

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
