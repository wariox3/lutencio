import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import { Validaciones } from "@/constants/mensajes";
import React from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H4, Spinner, View } from "tamagui";
import useOlvidoClaveViewModel from "../../application/view-models/use-olvido-clave.view-model";

export default function OlvidoClave() {
  const { control, handleOlvidoClave, handleSubmit, isLoading } =
    useOlvidoClaveViewModel();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View gap="$4" flex={1} paddingInline="$4">
            <H4>Recordar contraseña</H4>
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
              keyboardType="email-address"
            />

            <Button
              theme="blue"
              icon={isLoading ? () => <Spinner /> : undefined}
              onPress={handleSubmit(handleOlvidoClave)}
            >
              Enviar
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
