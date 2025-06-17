import { BasicInput } from "@/src/shared/components/form/inputs/basic-Input";
import CheckInput from "@/src/shared/components/form/inputs/check-Input";
import { PasswordInput } from "@/src/shared/components/form/inputs/password-Input";
import React from "react";
import { KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H4, ScrollView, Spinner, View } from "tamagui";
import { useCrearCuentaViewModel } from "../../application/view-models/use-crear-cuenta.view-model";
import { Validaciones } from "@/src/core/constants";

const CrearCuentaScreen = () => {
  const { control, handleSubmit, submit, loading, obtenerColor } =
    useCrearCuentaViewModel();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        rowGap: "$4",
      }}
      flex={1}
      paddingInline="$4"
      style={{ flex: 1, backgroundColor: obtenerColor("BLANCO", "NEGRO") }}
    >
      <BasicInput
        name="username"
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

      <Button
        theme="blue"
        icon={loading ? () => <Spinner /> : undefined}
        onPress={handleSubmit(submit)}
      >
        Crear cuenta
      </Button>
    </ScrollView>
  );
};

export default CrearCuentaScreen;
