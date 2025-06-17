import { obtenerConfiguracionModoPrueba } from "@/src/application/selectors/configuracion.selector";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import storageService from "@/src/core/services/storage.service";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { LoginFormType } from "../../domain/types/login.types";
import { loginThunk } from "../slices/auth.thunk";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";

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
      await dispatch(
        loginThunk({ username: data.username, password: data.password })
      ).unwrap();
      handleNavegarApp();
    } catch (error) {}
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
