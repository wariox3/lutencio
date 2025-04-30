import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { CrearCuentaFormType } from "../../domain/interfaces/crear-cuenta.interface";
import { crearCuentaThunk, loginThunk } from "../slices/auth.thunk";

export const useCrearCuentaViewModel = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(({ auth }) => auth);

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
      router.replace("/(app)/(maindreawer)");
    } catch (error) {}
  };

  return {
    submit,
    control,
    handleSubmit,
    loading,
    error,
  };
};
