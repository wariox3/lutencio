import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import APIS from "@/constants/endpoint";
import { Validaciones } from "@/constants/mensajes";
import { consultarApi } from "@/utils/api";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Keyboard, KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H4, Spinner, View } from "tamagui";

export default function OlvidoClave() {

  const { control, handleSubmit} = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  });

  const [mostrarAnimacionCargando, setMostrarAnimacionCargando] =
    useState(false);
  const router = useRouter();

  const crearCuentaPressed = async (data: { email: string }) => {
    setMostrarAnimacionCargando(true);
    Keyboard.dismiss();

    try {
      const respuestaApiLogin = await consultarApi<any>(
        APIS.seguridad.cambioClaveSolicitar,
        {
          username: data.email,
        }
      );

      setMostrarAnimacionCargando(false);

      if (respuestaApiLogin.user) {
        router.replace("/(app)/(login)");
      }
    } catch (error: any) {
      setMostrarAnimacionCargando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View gap="$4" flex={1} paddingInline="$4">
            <H4 mt="$8">Recordar contraseña</H4>
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

            <Button
              theme="blue"
              icon={mostrarAnimacionCargando ? () => <Spinner /> : undefined}
              onPress={handleSubmit(crearCuentaPressed)}
            >
              Enviar
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
