import { Validaciones } from "@/src/core/constants";
import { BasicInput } from "@/src/shared/components/form/inputs/basic-Input";
import { Button, ScrollView, Spinner } from "tamagui";
import useVisitaCargarViewModel from "../../application/view-model/use-visita-cargar.view-model";

const VisitaCargarScreen = () => {
  const { control, handleSubmit, cargarOrden, loading, obtenerColor } =
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
      bg={
        obtenerColor("BLANCO","NEGRO")
      }
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
