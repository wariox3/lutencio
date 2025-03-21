import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import { Validaciones } from "@/constants/mensajes";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H4, Spinner, View } from "tamagui";

const entregaCargar = () => {
  const [mostrarAnimacionCargando, setMostrarAnimacionCargando] =
    useState(false);
  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      codigo: "",
    },
  });
  const onLoginPressed = async (data: { codigo: string }) => {
    setMostrarAnimacionCargando(true);
    // try {
    //   const respuestaApiLogin = await consultarApi<any>(
    //     APIS.seguridad.login,
    //     { username: data.email, password: data.password },
    //     { requiereToken: false }
    //   );
    //   setMostrarAnimacionCargando(false);
    //   dispatch(setUsuarioInformacion(respuestaApiLogin.user));
    //   await AsyncStorage.setItem("jwtToken", respuestaApiLogin.token);
    //   router.navigate("/(app)/(maindreawer)");
    // } catch (error) {
    setMostrarAnimacionCargando(false);
    // }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View gap="$4" flex={1} paddingInline="$4">
            <H4>Cargar</H4>
            <BasicInput
              name="codigo"
              control={control}
              label="Código"
              isRequired={true}
              placeholder="Código despacho"
              rules={{
                required: Validaciones.comunes.requerido,
              }}
            />
            <Button
              theme="blue"
              icon={mostrarAnimacionCargando ? () => <Spinner /> : undefined}
              onPress={handleSubmit(onLoginPressed)}
            >
              Cargar
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default entregaCargar;
