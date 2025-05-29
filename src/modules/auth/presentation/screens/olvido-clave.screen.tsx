import { BasicInput } from "@/src/shared/components/form/inputs/BasicInput";
import { Validaciones } from "@/src/core/constants";
import React from "react";
import { Button, Spinner, View, ScrollView } from "tamagui";
import useOlvidoClaveViewModel from "../../application/view-models/use-olvido-clave.view-model";

export default function OlvidoClave() {
  const { control, handleOlvidoClave, handleSubmit, isLoading } =
    useOlvidoClaveViewModel();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        rowGap: "$4",
      }}
      flex={1}
      paddingInline="$4"
      bg={"#ffff"}
    >
      <View gap="$4" flex={1} paddingInline="$4">
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
  );
}
