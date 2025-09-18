import { obtenerConfiguracionModoPrueba } from "@/src/application/selectors/configuracion.selector";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { ApiErrorResponse } from "@/src/core/api/domain/interfaces/api.interface";
import storageService from "@/src/core/services/storage.service";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { LoginFormType } from "../../domain/types/login.types";
import { loginThunk } from "../slices/auth.thunk";
import { validarVersionApp } from "@/src/core/services/validar-version-app.service";

export const useLoginViewModel = () => {
  const modoPrueba = useAppSelector(obtenerConfiguracionModoPrueba);
  const router = useRouter();
  const { obtenerColor } = useTemaVisual();

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(({ auth }) => auth);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormType>({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submit = async (data: LoginFormType) => {
    try {
      const puedeContinuar = await validarVersionApp();
      if (!puedeContinuar) return;

      await dispatch(
        loginThunk({ username: data.username, password: data.password })
      ).unwrap();

      handleNavegarApp();
    } catch (error: any) {
      const errorParseado = error as ApiErrorResponse
      mostrarAlertHook({
        mensaje: errorParseado.mensaje,
        titulo: errorParseado.titulo
      })
    }
  };

  useFocusEffect(
    useCallback(() => {
      validarToken();
    }, [])
  );

  const validarToken = async () => {
    const token = await storageService.getAuthToken();
    if (token) {
      handleNavegarApp();
    }
  };

  const handleNavegarApp = () => {
    router.replace("/(app)");
  };

  const handleNavegarRegistrarse = () => {
    reset();
    router.navigate("/crear-cuenta");
  };

  const handleNagevarOlvideClave = () => {
    reset();
    router.navigate("/olvido-clave");
  };

  return {
    loading,
    error,
    submit,
    control,
    handleSubmit,
    errors,
    modoPrueba,
    handleNagevarOlvideClave,
    handleNavegarRegistrarse,
    obtenerColor
  };
};
