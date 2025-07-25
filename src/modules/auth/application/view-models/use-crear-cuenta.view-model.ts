import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { CrearCuentaFormType } from "../../domain/interfaces/crear-cuenta.interface";
import { crearCuentaThunk, loginThunk } from "../slices/auth.thunk";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { ApiErrorResponse } from "@/src/core/api/domain/interfaces/api.interface";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";

export const useCrearCuentaViewModel = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(({ auth }) => auth);
  const { obtenerColor } = useTemaVisual();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CrearCuentaFormType>({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      confirmarPassword: "",
      aceptarTerminosCondiciones: false,
    },
  });

  const submit = async (data: CrearCuentaFormType) => {
    try {
      const respuestaCrearCuenta = await dispatch(
        crearCuentaThunk(data)
      ).unwrap();
      if (respuestaCrearCuenta.usuario) {
        await dispatch(
          loginThunk({ username: data.username, password: data.password })
        ).unwrap();
      }
      handleNavegarApp();
    } catch (error: any) {
      const errorParseado = error as ApiErrorResponse
      mostrarAlertHook({
        mensaje: errorParseado.mensaje,
        titulo: errorParseado.titulo
      })
    }
  };

  const handleNavegarApp = () => {
    router.replace("/(app)");
  }

  return {
    submit,
    control,
    handleSubmit,
    loading,
    error,
    obtenerColor
  };
};
