import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { LoginFormType } from "../../domain/types/login.types";
import { loginThunk } from "../slices/auth.thunk";
import { obtenerConfiguracionModoPrueba } from "@/store/selects/configuracion";
import { useSelector } from "react-redux";

export const useLoginViewModel = () => {
  const modoPrueba = useSelector(obtenerConfiguracionModoPrueba);
  const router = useRouter();

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
      router.replace("/(app)");
    } catch (error) {
    }
  };

  const handleNavegarRegistrarse = () => {
    reset();
    router.navigate('/crear-cuenta');
  };

  const handleNagevarOlvideClave = () => {
    reset();
    router.navigate('/olvido-clave');
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
  };
};