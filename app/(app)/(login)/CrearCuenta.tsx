import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import CheckInput from "@/components/ui/form/inputs/CheckInput";
import { PasswordInput } from "@/components/ui/form/inputs/PasswordInput";
import APIS from "@/constants/endpoint";
import { Validaciones } from "@/constants/mensajes";
import { setUsuarioInformacion } from "@/store/reducers/usuarioReducer";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Alert, Keyboard, KeyboardAvoidingView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { Button, H4, Spinner, View } from "tamagui";

export default function CrearCuenta() {
  const [mostrarClave, setMostrarClave] = useState<boolean>(false);
  const [mostrarConfirmarClave, setMostrarConfirmarClave] =
    useState<boolean>(false);
  const [mostrarAnimacionCargando, setMostrarAnimacionCargando] =
    useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const { control, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmarPassword: "",
      aceptarTerminosCondiciones: false,
    },
  });

  const crearCuentaPressed = async (data: {
    email: string;
    password: string;
    confirmarPassword: string;
    aceptarTerminosCondiciones: boolean;
  }) => {
    Keyboard.dismiss();
    setMostrarAnimacionCargando(true);

    if (!data.aceptarTerminosCondiciones) {
      Alert.alert("Error", "Debes aceptar los términos y condiciones.");
      setMostrarAnimacionCargando(false);
      return;
    }

    if (data.password !== data.confirmarPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      setMostrarAnimacionCargando(false);
      return;
    }

    try {
      const respuestaApiCrearUsuario = await consultarApi<any>(
        APIS.seguridad.usuario,
        {
          username: data.email,
          password: data.password,
        },
        { requiereToken: false }
      );

      if (respuestaApiCrearUsuario.usuario) {
        await loginPostRegistro(data.email, data.password);
      } else {
        setMostrarAnimacionCargando(false);
      }
    } catch (error: any) {
      setMostrarAnimacionCargando(false);
    }
  };

  const loginPostRegistro = async (email: string, password: string) => {
    try {
      const respuestaApiLogin = await consultarApi<any>(
        APIS.seguridad.login,
        { username: email, password },
        { requiereToken: false }
      );

      setMostrarAnimacionCargando(false);
      dispatch(setUsuarioInformacion(respuestaApiLogin.user));
      await AsyncStorage.setItem("jwtToken", respuestaApiLogin.token);
      router.replace("/(app)/(maindreawer)");
    } catch (error: any) {
      setMostrarAnimacionCargando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View gap="$4" flex={1} paddingInline="$4">
            <H4 mt="$8">Crear cuenta</H4>

            {/* Campo de correo */}
            <BasicInput
              name="email"
              control={control}
              isRequired={true}
              label="Correo"
              placeholder="Introduce tu correo"
              rules={{
                required: Validaciones.comunes.requerido,
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                  message: Validaciones.comunes.correoNoValido,
                },
              }}
            />

            <PasswordInput
              name="password"
              control={control}
              isRequired={true}
              label="Clave"
              rules={{
                required: Validaciones.comunes.requerido,
                minLength: {
                  value: 8,
                  message: Validaciones.comunes.minimoCaracteres + 8,
                },
              }}
            />

            <PasswordInput
              name="confirmarPassword"
              control={control}
              isRequired={true}
              label="Confirmar clave"
              rules={{
                required: Validaciones.comunes.requerido,
                minLength: {
                  value: 8,
                  message: Validaciones.comunes.minimoCaracteres + 8,
                },
              }}
            />

            <CheckInput
              label="Aceptar terminos & condiciones"
              name="aceptarTerminosCondiciones"
              isRequired={true}
              control={control}
              rules={{
                validate: (value) =>
                  value || "Debes aceptar los términos y condiciones.",
              }}
            />

            {/* Botón de envío */}
            <Button
              theme="blue"
              icon={mostrarAnimacionCargando ? () => <Spinner /> : undefined}
              onPress={handleSubmit(crearCuentaPressed)}
            >
              Crear cuenta
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
