import { TextAreaInput } from "@/components/ui/form/inputs/TextAreaInput";
import ModalAlert from "@/src/shared/components/modal-alert";
import useVisitaSolucionNovedadViewModel from "../../application/view-model/use-visita-solucion-novedad.view-model";
import { Button, Spinner, View } from "tamagui";
import React from "react";
import { Validaciones } from "@/constants/mensajes";

export default function visitaFormularioSolucionNovedad() {
  const { control, state, handleSubmit, guardarSolucion } =
    useVisitaSolucionNovedadViewModel();

  return (
    <ModalAlert titulo="Solucionar novedad">
      <View gap="$4" flex={1}>
        <TextAreaInput
          label="Solución"
          name="solucion"
          control={control}
          isRequired={true}
          placeholder=""
          rules={{
            required: Validaciones.comunes.requerido,
          }}
        ></TextAreaInput>
        <Button
          theme="blue"
          icon={state.mostrarAnimacionCargando ? () => <Spinner /> : undefined}
          onPress={handleSubmit(guardarSolucion)}
          mb={"$2.5"}
        >
          Guardar
        </Button>
      </View>
    </ModalAlert>
  );
}
