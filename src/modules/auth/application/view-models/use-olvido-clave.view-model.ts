import { useForm } from "react-hook-form";
import { OlvidoClaveFormType } from "../../domain/types/olvido-clave.type";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard } from "react-native";
import { OlvidoClaveUseCase } from "../user-cases/olvido-clave.use-case";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { ApiErrorResponse } from "@/src/core/api/domain/interfaces/api.interface";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";

export default function useOlvidoClaveViewModel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm<OlvidoClaveFormType>({
    defaultValues: {
      username: "",
    },
  });
  const { obtenerColor } = useTemaVisual();

  const handleOlvidoClave = async (data: OlvidoClaveFormType) => {
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      const respuestaApiLogin = await new OlvidoClaveUseCase().execute(data);

      if (respuestaApiLogin.verificacion) {
        router.replace(rutasApp.login);
      }
    } catch (error: any) {
      const errorParseado = error as ApiErrorResponse
      mostrarAlertHook({
        mensaje: errorParseado.mensaje,
        titulo: errorParseado.titulo
      })
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    control,
    handleSubmit,
    handleOlvidoClave,
    obtenerColor
  };
}
