import Titulo from "@/components/ui/comun/Titulo";
import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import { PasswordInput } from "@/components/ui/form/inputs/PasswordInput";
import MensajeModoPrueba from "@/components/ui/login/MensajeModoPrueba";
import ModoPruebaSheet from "@/components/ui/login/ModoPruebaSheet";
import APIS from "@/constants/endpoint";
import { Validaciones } from "@/constants/mensajes";
import { setUsuarioInformacion } from "@/store/reducers/usuarioReducer";
import { obtenerConfiguracionModoPrueba } from "@/store/selects/configuracion";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Button, ScrollView, Spinner, View, XStack } from "tamagui";

export default function LoginForm() {
  const [mostrarAnimacionCargando, setMostrarAnimacionCargando] =
    useState(false);
  const modoPrueba = useSelector(obtenerConfiguracionModoPrueba);
  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const dispatch = useDispatch();

  useFocusEffect(() => {
    const verificarToken = async () => {
      const token = await AsyncStorage.getItem("jwtToken");
      if (token) {
        router.replace("/(app)/(maindreawer)");
      }
    };
    verificarToken();
  })

  const onLoginPressed = async (data: { email: string; password: string }) => {
    setMostrarAnimacionCargando(true);

    try {
      const respuestaApiLogin = await consultarApi<any>(
        APIS.seguridad.login,
        { username: data.email, password: data.password },
        { requiereToken: false }
      );

      setMostrarAnimacionCargando(false);
      dispatch(setUsuarioInformacion(respuestaApiLogin.user));
      await AsyncStorage.setItem("jwtToken", respuestaApiLogin.token);
      router.replace("/(app)/(maindreawer)");
    } catch (error) {
      setMostrarAnimacionCargando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <XStack justify={'space-between'}>
          <Titulo texto="Ingresar" />
          <ModoPruebaSheet
          ></ModoPruebaSheet>
        </XStack>
        <View gap="$4" flex={1} paddingInline="$4">
          {
            modoPrueba ? (
              <MensajeModoPrueba></MensajeModoPrueba>
            ) : null
          }
          <BasicInput
            name="email"
            control={control} label="Correo"
            isRequired={true}
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
            label="Clave"
            isRequired={true}
            rules={{
              required: Validaciones.comunes.requerido,
              minLength: {
                value: 8,
                message: Validaciones.comunes.minimoCaracteres + 8,
              },
            }}
          />
          <Button
            theme="blue"
            icon={mostrarAnimacionCargando ? () => <Spinner /> : undefined}
            onPress={handleSubmit(onLoginPressed)}
          >
            Ingresar
          </Button>

          <Button
            theme="blue"
            variant="outlined"
            onPress={() => {
              reset();
              router.navigate("/CrearCuenta");
            }}
            chromeless
          >
            Crear cuenta
          </Button>

          <Button
            theme="blue"
            variant="outlined"
            onPress={() => {
              reset();
              router.navigate("/OlvidoClave");
            }}
            chromeless
          >
            ¿Olvidaste la contraseña?
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
