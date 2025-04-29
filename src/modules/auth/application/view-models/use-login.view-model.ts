import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { LoginFormType } from "../../domain/types/login.types";
import { loginThunk } from "../slices/auth.thunk";

export const useLoginViewModel = () => {
  const modoPrueba = true;
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
      router.replace("/(app)/(maindreawer)");
    } catch (error) {
    }
  };

  const handleNavegarRegistrarse = () => {
    reset();
    router.navigate("/CrearCuenta");
  };

  const handleNagevarOlvideClave = () => {
    reset();
    router.navigate("/OlvidoClave");
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

// const [mostrarAnimacionCargando, setMostrarAnimacionCargando] =
//   useState(false);
// const modoPrueba = useSelector(obtenerConfiguracionModoPrueba);
// const { control, handleSubmit, reset } = useForm<FieldValues>({
//   defaultValues: {
//     email: "",
//     password: "",
//   },
// });
// const router = useRouter();
// const dispatch = useDispatch();

// useFocusEffect(() => {
//   const verificarToken = async () => {
//     const token = await AsyncStorage.getItem("jwtToken");
//     if (token) {
//       router.replace("/(app)/(maindreawer)");
//     }
//   };
//   verificarToken();
// });

// const onLoginPressed = async (data: { email: string; password: string }) => {
//   setMostrarAnimacionCargando(true);

//   try {
//     const respuestaApiLogin = await consultarApi<any>(
//       APIS.seguridad.login,
//       { username: data.email, password: data.password },
//       { requiereToken: false }
//     );

//     setMostrarAnimacionCargando(false);
//     dispatch(setUsuarioInformacion(respuestaApiLogin.user));
//     await AsyncStorage.setItem("jwtToken", respuestaApiLogin.token);
//     router.replace("/(app)/(maindreawer)");
//   } catch (error) {
//     setMostrarAnimacionCargando(false);
//   }
// };
