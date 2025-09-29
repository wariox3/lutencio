import { TextAreaInput } from "@/src/shared/components/form/inputs/text-area-Input";
import ModalAlert from "@/src/shared/components/comun/modal-alert";
import { Button, Spinner, View } from "tamagui";
import React, { memo } from "react";
import { Validaciones } from "@/src/core/constants";
import useVisitaNovedadSolucionViewModel from "../../application/view-model/use-visita-novedad-solucion.view-model";
import COLORES from "@/src/core/constants/colores.constant";

const VisitaFormularioNovedadSolucion: React.FC = () => {
  const { control, state, handleSubmit, guardarSolucion, obtenerColor } =
    useVisitaNovedadSolucionViewModel();

  return (
    <ModalAlert titulo="Solucionar novedad">
      <View gap="$4" flex={1} bg={obtenerColor("BLANCO", "NEGRO")}>
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
};

export default memo(VisitaFormularioNovedadSolucion);
