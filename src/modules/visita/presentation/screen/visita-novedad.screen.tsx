import { EntregaCamara } from "@/src/modules/visita/presentation/components/form/camara";
import EntregaImagenesPreview from "@/src/modules/visita/presentation/components/form/imagenes-preview";
import { SelectInput } from "@/src/shared/components/form/inputs/select-Input";
import { TextAreaInput } from "@/src/shared/components/form/inputs/text-area-Input";
import { Validaciones } from "@/src/core/constants";
import { Controller } from "react-hook-form";
import {
  Button,
  H6,
  ScrollView,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useVisitaNovedadViewModel from "../../application/view-model/use-visita-novedad.view-model";
import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import CardInformacionVisita from "../components/form/card-informacion-visita";

const VisitaNovedadScreen = () => {
  const {
    control,
    guardarNovedad,
    handleCapture,
    removerFoto,
    state,
    isLoading,
    handleSubmit,
    novedadesTipo,
    obtenerColor,
    informacionEntregasSeleccionadas,
  } = useVisitaNovedadViewModel();

  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        flex={1}
        px="$4"
        pb={insets.bottom + 80} // 👈 hereda de Tamagui + espacio extra
        bg={obtenerColor("BLANCO", "NEGRO")}
        contentContainerStyle={{
          rowGap: 16, // más natural para Tamagui
        }}
      >
        <YStack mt="$4" mb="$2">
          <H6 mb={"$0.75"}>Seleccionas</H6>
          <XStack>
            <ScrollView
              horizontal
              rowGap="$4"
              contentContainerStyle={{
                rowGap: "$2",
              }}
              showsHorizontalScrollIndicator={false}
              contentInsetAdjustmentBehavior="automatic"
              keyboardShouldPersistTaps="handled"
            >
              {informacionEntregasSeleccionadas.map((visita, index) => (
                <CardInformacionVisita
                  visita={visita}
                  key={index.toLocaleString()}
                ></CardInformacionVisita>
              ))}
            </ScrollView>
          </XStack>
        </YStack>
        <TextAreaInput
          name="descripcion"
          control={control}
          label="Descripción"
          isRequired
          placeholder="Descripción"
          rules={{
            required: Validaciones.comunes.requerido,
          }}
        />

        <SelectInput
          name="novedad_tipo"
          control={control}
          label="Tipo de novedad"
          isRequired
          placeholder="Seleccionar un tipo de novedad"
          data={novedadesTipo}
          rules={{
            required: Validaciones.comunes.requerido,
            validate: (value: string) =>
              value !== "0" || Validaciones.comunes.requerido,
          }}
        />

        <XStack justify="space-between">
          <Controller
            name="foto"
            control={control}
            rules={{
              required: Validaciones.comunes.requerido,
            }}
            render={({ fieldState: { error } }) => (
              <YStack>
                <Text>
                  Fotografías disponibles {state.arrImagenes.length} de 1
                  {state.exigeImagenEntrega ? (
                    <Text color="red" paddingStart="$2">
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
            <EntregaCamara onCapture={handleCapture} />
          ) : null}
        </XStack>

        {state.arrImagenes.length > 0 ? (
          <EntregaImagenesPreview
            arrImagenes={state.arrImagenes}
            removerFoto={removerFoto}
          />
        ) : null}
      </ScrollView>

      {/* Footer con botón fijo */}
      <View p="$4" bg={obtenerColor("BLANCO", "NEGRO")}>
        <Button
          theme="blue"
          icon={isLoading ? () => <Spinner /> : undefined}
          onPress={handleSubmit(guardarNovedad)}
          disabled={isLoading}
        >
          Guardar
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VisitaNovedadScreen;
