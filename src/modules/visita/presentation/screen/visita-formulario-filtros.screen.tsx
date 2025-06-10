import { BasicInput } from "@/src/shared/components/form/inputs/basic-Input";
import { XCircle } from "@tamagui/lucide-icons";
import React from "react";
import { H6, YGroup, View, XStack, H4, Button, Spinner } from "tamagui";
import useVisitaFiltrosViewModel from "../../application/view-model/use.visita-filtros-view-model";

const FormularioFiltros = ({ close }: { close: () => void }) => {
  const { control, handleSubmit, filtrarEntregas } =
    useVisitaFiltrosViewModel();

  return (
    <View>
      <XStack justify="space-between">
        <H4 mb="$2">Filtrar Visitas </H4>
        <Button
          size="$4"
          circular
          icon={<XCircle size="$3" color={"$red10"} />}
          onPress={close}
          theme={"red"}
        />
      </XStack>
      <YGroup size="$4" gap="$4">
        <H6>Utiliza los filtros para encontrar visitas específicas</H6>
        <BasicInput
          name="guia"
          control={control}
          label="Guía"
          isRequired={false}
          keyboardType="number-pad"
          placeholder="Buscar por guia"
        />
        <BasicInput
          name="numero"
          control={control}
          label="Número"
          isRequired={false}
          keyboardType="number-pad"
          placeholder="Buscar por número"
        />
        <Button
          theme="blue"
          onPress={(filtrarEntregas(close))}
          mb={"$2.5"}
        >
          Filtrar
        </Button>
      </YGroup>
    </View>
  );
};

export default FormularioFiltros;
