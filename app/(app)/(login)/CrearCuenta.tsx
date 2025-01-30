import APIS from "@/constants/endpoint";
import { setUsuarioInformacion } from "@/store/reducers/usuarioReducer";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Check as CheckIcon, Eye, EyeOff } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import {
  Button,
  Checkbox,
  Form,
  H4,
  Input,
  Label,
  Spinner,
  View,
  XStack,
} from "tamagui";

// import Contenedor from "@/components/common/Contenedor";
// import TextInput from "@/components/common/TextInput";
// import Button from "@/components/common/Button";
// import { validarCorreoElectronico } from "@/constants/personalidades";
// import { consultarApi } from "@/utils/api";

export default function CrearCuenta() {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [confirmarPassword, setConfirmarPassword] = useState({
    value: "",
    error: "",
  });
  const [aceptarTerminosCondiciones, setAceptarTerminosCondiciones] =
    useState<boolean>(false);
  const [mostrarClave, setMostrarClave] = useState<boolean>(false);
  const [mostrarConfirmarClave, setMostrarConfirmarClave] =
    useState<boolean>(false);

  const [mostrarAnimacionCargando, setMostrarAnimacionCargando] =
    useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const crearCuentaPressed = async () => {
    Keyboard.dismiss();
    setMostrarAnimacionCargando(true);
    if (aceptarTerminosCondiciones) {
      if (password === confirmarPassword) {
        try {
          const respuestaApiCrearUsuario = await consultarApi<any>(
            APIS.seguridad.usuario,
            {
              username: email.value,
              password: password.value,
            },
            {
              requiereToken: false,
            }
          );
          if (respuestaApiCrearUsuario.usuario) {
            loginPostRegistro();
          } else {
            Alert.alert("Algo ha salido mal", "error al crear usuario.");
            setMostrarAnimacionCargando(false);
          }
        } catch (error: any) {
          Alert.alert("Algo ha salido mal", "los campos son requeridos");
          setMostrarAnimacionCargando(false);
        }
      } else {
        Alert.alert("Algo ha salido mal", "Claves diferentes");
        setMostrarAnimacionCargando(false);
      }
    } else {
      Alert.alert("Algo ha salido mal", "Aceptar terminos y condiciones");
      setMostrarAnimacionCargando(false);
    }
  };

  const loginPostRegistro = async () => {
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
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View gap="$4" flex={1} paddingInline="$4">
            <H4 mt="$8">Crear cuenta</H4>
            <Label>Correo</Label>
            <Input
              size="$4"
              borderWidth={2}
              onChangeText={(text) => setEmail({ value: text, error: "" })}
            />
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

            <Label htmlFor="name">Confirmar clave</Label>

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
                onChangeText={(text) =>
                  setConfirmarPassword({ value: text, error: "" })
                }
                secureTextEntry={!mostrarConfirmarClave}
              />
              <Button
                borderStartStartRadius="$0"
                borderStartEndRadius="$0"
                borderEndEndRadius="$5"
                borderEndStartRadius="$5"
                icon={
                  mostrarConfirmarClave ? (
                    <Eye size="$1.5" />
                  ) : (
                    <EyeOff size="$1.5" />
                  )
                }
                onPress={() => setMostrarConfirmarClave(!mostrarConfirmarClave)}
              />
            </XStack>

            <XStack width={300} alignItems="center" gap="$4">
              <Checkbox
                size="$5"
                checked={aceptarTerminosCondiciones}
                onCheckedChange={() =>
                  setAceptarTerminosCondiciones(!aceptarTerminosCondiciones)
                }
              >
                <Checkbox.Indicator>
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox>

              <Label size="$5">Aceptar terminios y condiciones </Label>
            </XStack>

            <Button
              theme="blue"
              icon={mostrarAnimacionCargando ? () => <Spinner /> : undefined}
              onPress={() => crearCuentaPressed()}
            >
              Enviar
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
