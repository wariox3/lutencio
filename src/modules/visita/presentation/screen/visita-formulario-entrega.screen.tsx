import { EntregaCamara } from "@/src/modules/visita/presentation/components/form/camara";
import { EntregaFirma } from "@/src/modules/visita/presentation/components/form/firma";
import EntregaFirmaPreview from "@/src/modules/visita/presentation/components/form/firma-preview";
import EntregaImagenesPreview from "@/src/modules/visita/presentation/components/form/imagenes-preview";
import { BasicInput } from "@/src/shared/components/form/inputs/basic-Input";
import { SelectInput } from "@/src/shared/components/form/inputs/select-Input";
import { parentescos } from "@/src/core/constants/parentesco.constant";
import React from "react";
import { Button, H4, ScrollView, Spinner, Text, View, XStack } from "tamagui";
import useVisitaFormularioViewModel from "../../application/view-model/use-visita-formulario.view-model";
import { SafeAreaView } from "react-native";

const VisitaFormularioEntregaScreen = () => {
  const {
    control,
    entregasSeleccionadas,
    guardarEntrega,
    handleCapture,
    handleFirma,
    handleSubmit,
    removerFirma,
    state,
    isLoading,
    removerFoto,
    obtenerColor
  } = useVisitaFormularioViewModel();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      flex={1}
      contentContainerStyle={{
        rowGap: "$4",
      }}
      paddingInline="$4"
      bg={
        obtenerColor("BLANCO","NEGRO")
      }
    >
      <Text>Seleccionas: {entregasSeleccionadas.join(", ")}</Text>
      <XStack justify={"space-between"}>
        <Text>
          Fotografías disponibles {state.arrImagenes.length} de 5
          {state.exigeImagenEntrega ? <Text> Requerido * </Text> : null}
        </Text>
        {state.arrImagenes.length <= 4 ? (
          <EntregaCamara onCapture={handleCapture}></EntregaCamara>
        ) : null}
      </XStack>
      {state.arrImagenes.length > 0 ? (
        <EntregaImagenesPreview
          arrImagenes={state.arrImagenes}
          removerFoto={removerFoto}
        ></EntregaImagenesPreview>
      ) : null}

      <BasicInput
        name="recibe"
        control={control}
        label="Recibe"
        isRequired={false}
        placeholder="Persona que recibe el paquete"
      />
      <BasicInput
        name="numeroIdentificacion"
        control={control}
        label="Numero identificación"
        isRequired={false}
        placeholder="000000"
        keyboardType="numeric"
      />
      <SelectInput
        name="parentesco"
        control={control}
        label="Parentesco"
        isRequired={false}
        placeholder="Seleccionar un parentesco"
        data={parentescos}
      />
      <BasicInput
        name="celular"
        control={control}
        label="Celular"
        isRequired={false}
        keyboardType="numeric"
        placeholder="000000"
      />
      <XStack justify={"space-between"}>
        <Text>
          Firma
          {state.exigeFirmaEntrega ? <Text> Requerido * </Text> : null}
        </Text>
        {state.firmarBase64 === null ? (
          <EntregaFirma onCapture={handleFirma}></EntregaFirma>
        ) : null}
      </XStack>
      {state.firmarBase64 !== null ? (
        <EntregaFirmaPreview
          imagen={state.firmarBase64}
          removerFirma={removerFirma}
        ></EntregaFirmaPreview>
      ) : null}

      <Button
        theme="blue"
        icon={isLoading ? () => <Spinner /> : undefined}
        onPress={handleSubmit(guardarEntrega)}
        disabled={isLoading}
        mb={"$2.5"}
      >
        Entregar
      </Button>
    </ScrollView>
  );
};

export default VisitaFormularioEntregaScreen;
