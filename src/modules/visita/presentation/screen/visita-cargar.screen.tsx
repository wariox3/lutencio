import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import { Validaciones } from "@/constants/mensajes";
import React from "react";
import { Button, H4, ScrollView, Spinner, View } from "tamagui";
import useVisitaCargarViewModel from "../../application/view-model/use-visita-cargar.view-model";

const VisitaCargarScreen = () => {
  const { control, handleSubmit, cargarOrden, loading } =
    useVisitaCargarViewModel();

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
      <BasicInput
        name="codigo"
        control={control}
        label="Orden de entrega"
        isRequired={true}
        placeholder="123"
        keyboardType="numeric"
        rules={{
          required: Validaciones.comunes.requerido,
        }}
      />
      
      <Button
        theme={loading ? "accent" : "blue"}
        icon={loading ? () => <Spinner /> : undefined}
        disabled={loading}
        onPress={handleSubmit(cargarOrden)}
      >
        Vincular
      </Button>
    </ScrollView>
  );
};

export default VisitaCargarScreen;
