import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { actualizarFiltros } from "../slice/entrega.slice";
import { useAppDispatch } from "@/src/application/store/hooks";

export default function useVisitaFiltrosViewModel() {
  const valoresFormularioFiltros = {
    guia: "",
    numero: ""
  };
  const dispatch = useAppDispatch();

  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: valoresFormularioFiltros,
  });

  useFocusEffect(
    useCallback(() => {
      reset(valoresFormularioFiltros);
    }, [])
  );



  const filtrarEntregas = (close?: () => void) =>
    handleSubmit(async (data) => {
      Keyboard.dismiss();
      reset(valoresFormularioFiltros);

      dispatch(
        actualizarFiltros({
          guia: Number(data.guia) || 0,
          numero: Number(data.numero) || 0,
        })
      );

      close?.(); // cerrar modal si se pasa
    });



  return { control, handleSubmit, filtrarEntregas };
}
