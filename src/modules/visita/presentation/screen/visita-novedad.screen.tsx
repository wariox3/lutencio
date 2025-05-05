import Titulo from "@/components/ui/comun/Titulo";
import { EntregaCamara } from "@/components/ui/entrega/entregaCamara";
import EntregaImagenesPreview from "@/components/ui/entrega/entregaImagenesPreview";
import { SelectInput } from "@/components/ui/form/inputs/SelectInput";
import { TextAreaInput } from "@/components/ui/form/inputs/TextAreaInput";
import { Validaciones } from "@/constants/mensajes";
import { Loader } from "@tamagui/lucide-icons";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  ScrollView,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import useVisitaNovedadViewModel from "../../application/view-model/use-visita-novedad.view-model";
import { Controller } from "react-hook-form";

const VisitaNovedadScreen = () => {
  const {
    control,
    guardarNovedadTipo,
    handleCapture,
    removerFoto,
    state,
    handleSubmit,
  } = useVisitaNovedadViewModel();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View gap="$4" flex={1} paddingInline="$4">
          <Titulo texto="Novedad"></Titulo>
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
          <>
            {state.arrNovedadesTipo.length > 0 ? (
              <>
                <SelectInput
                  name="novedad_tipo"
                  control={control}
                  label="Tipo de novedad"
                  isRequired={true}
                  placeholder="Seleccionar un tipo de novedad"
                  data={state.arrNovedadesTipo}
                  rules={{
                    required: Validaciones.comunes.requerido,
                    validate: (value: string) => value !== "0" || Validaciones.comunes.requerido,                      
                  }}
                />
              </>
            ) : (
              <Loader></Loader>
            )}
          </>
          <XStack justify={"space-between"}>
            <Controller
              name="foto"
              control={control}
              rules={{
                required: Validaciones.comunes.requerido,
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
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
            icon={
              state.mostrarAnimacionCargando ? () => <Spinner /> : undefined
            }
            onPress={handleSubmit(guardarNovedadTipo)}
          >
            Guardar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VisitaNovedadScreen;
