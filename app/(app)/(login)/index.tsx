import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import {
  Button,
  Form,
  H4,
  Input,
  Label,
  ScrollView,
  Spinner,
  Text,
  View,
  XStack,
} from "tamagui";
import { consultarApi } from "@/utils/api";
import APIS from "@/constants/endpoint";
import { setUsuarioInformacion } from "@/store/reducers/usuarioReducer";
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Validaciones } from "@/constants/mensajes";
import { validarCorreoElectronico } from "@/utils/funciones";

export default function LoginIndex() {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [mostrarAnimacionCargando, setMostrarAnimacionCargando] =
    useState<boolean>(false);
  const [mostrarClave, setMostrarClave] = useState<boolean>(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const onLoginPressed = async () => {
    Keyboard.dismiss();
    setMostrarAnimacionCargando(true);
    validacionesFormulario();
    if (validarCorreoElectronico(email.value)) {
      try {
        const respuestaApiLogin = await consultarApi<any>(
          APIS.seguridad.login,
          {
            username: email.value,
            password: password.value,
          },
          {
            requiereToken: false,
          }
        );
        setMostrarAnimacionCargando(false);
        dispatch(setUsuarioInformacion(respuestaApiLogin.user));
        await AsyncStorage.setItem("jwtToken", respuestaApiLogin.token);
        router.navigate("/(app)/(maindreawer)");
      } catch (error: any) {
        Alert.alert("Algo ha salido mal", "error al autenticar.");
        setMostrarAnimacionCargando(false);
      }
    } else {
      setMostrarAnimacionCargando(false);
      setEmail((prevState) => ({
        ...prevState,
        error: Validaciones.comunes.correoNoValido,
      }));
    }
  };

  const validacionesFormulario = () => {
    if (email.value === "") {
      setEmail((prevState) => ({
        ...prevState,
        error: Validaciones.comunes.requerido,
      }));
    }

    if (password.value === "") {
      setPassword((prevState) => ({
        ...prevState,
        error: Validaciones.comunes.requerido,
      }));
    }

  };
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View gap="$4" flex={1} paddingInline="$4">
            <H4 mt="$6">Ingresar</H4>

            <Label>Correo *</Label>
            <Input
              size="$4"
              borderWidth={1}
              onChangeText={(text) =>   setEmail({ value: text, error: "" })}
            />

             {email.error !== '' ? <Text color={'red'}>{email.error}</Text> : null}
            <Label htmlFor="name">Clave</Label>
            <XStack
              paddingEnd="$1"
              borderColor="$borderColor"
              borderEndEndRadius="$5"
              borderEndStartRadius="$5"
              borderStartStartRadius="$5"
              borderStartEndRadius="$5"
              style={{
                padding: 0,
              }}
            >
              <Input
                flex={6}
                fontSize="$4"
                style={{
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                onChangeText={(text) => setPassword({ value: text, error: "" })}
                secureTextEntry={!mostrarClave}
              />

              <Button
                borderStartStartRadius="$0"
                borderStartEndRadius="$0"
                borderEndEndRadius="$5"
                borderEndStartRadius="$5"
                icon={
                  mostrarClave ? <Eye size="$1.5" /> : <EyeOff size="$1.5" />
                }
                onPress={() => setMostrarClave(!mostrarClave)}
              />
            </XStack>
            <Button
              theme="blue"
              icon={mostrarAnimacionCargando ? () => <Spinner /> : undefined}
              onPress={() => onLoginPressed()}
            >
              Enviar
            </Button>

            <Button
              theme="blue"
              variant="outlined"
              onPress={() => router.navigate("/CrearCuenta")}
              chromeless
            >
              Crear cuenta
            </Button>
            <Button
              theme="blue"
              variant="outlined"
              onPress={() => router.navigate("/OlvidoClave")}
              chromeless
            >
              ¿Olvidaste la contraseña?
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
