import { EntregaCamara } from "@/src/modules/visita/presentation/components/form/camara";
import EntregaImagenesPreview from "@/src/modules/visita/presentation/components/form/imagenes-preview";
import { SelectInput } from "@/src/shared/components/form/inputs/select-Input";
import { TextAreaInput } from "@/src/shared/components/form/inputs/text-area-Input";
import { Validaciones } from "@/src/core/constants";
import React from "react";
import { Controller } from "react-hook-form";
import {
  Button,
  ScrollView,
  Spinner,
  Text,
  XStack,
  YStack
} from "tamagui";
import useVisitaNovedadViewModel from "../../application/view-model/use-visita-novedad.view-model";

const VisitaNovedadScreen = () => {
  const {
    control,
    guardarNovedad,
    handleCapture,
    removerFoto,
    state,
    handleSubmit,
    novedadesTipo,
  } = useVisitaNovedadViewModel();

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
      <TextAreaInput
        name="descripcion"
        control={control}
        label="Descripción"
        isRequired={true}
        placeholder="Descripción"
        rules={{
          required: Validaciones.comunes.requerido,
        }}
      ></TextAreaInput>
      <SelectInput
        name="novedad_tipo"
        control={control}
        label="Tipo de novedad"
        isRequired={true}
        placeholder="Seleccionar un tipo de novedad"
        data={novedadesTipo}
        rules={{
          required: Validaciones.comunes.requerido,
          validate: (value: string) =>
            value !== "0" || Validaciones.comunes.requerido,
        }}
      />
      <XStack justify={"space-between"}>
        <Controller
          name="foto"
          control={control}
          rules={{
            required: Validaciones.comunes.requerido,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <YStack>
              <Text>
                Fotografías disponibles {state.arrImagenes.length} de 1
                {state.exigeImagenEntrega ? (
                  <Text
                    // can add theme values
                    color="red"
                    paddingStart="$2"
                  >
                    {" "}
                    *
                  </Text>
                ) : null}
              </Text>
              {error && (
                <Text color="$red10" fontSize="$3" mt="$1">
                  {error.message}
                </Text>
              )}
            </YStack>
          )}
        />
        {state.arrImagenes.length <= 0 ? (
          <EntregaCamara onCapture={handleCapture}></EntregaCamara>
        ) : null}
      </XStack>
      {state.arrImagenes.length > 0 ? (
        <EntregaImagenesPreview
          arrImagenes={state.arrImagenes}
          removerFoto={removerFoto}
        ></EntregaImagenesPreview>
      ) : null}
      <Button
        theme="blue"
        icon={state.mostrarAnimacionCargando ? () => <Spinner /> : undefined}
        onPress={handleSubmit(guardarNovedad)}
      >
        Guardar
      </Button>
    </ScrollView>
  );
};

export default VisitaNovedadScreen;
