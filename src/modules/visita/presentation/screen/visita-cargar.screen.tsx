import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import { Validaciones } from "@/constants/mensajes";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H4, Spinner, View } from "tamagui";
import useVisitaCargarViewModel from "../../application/view-model/use-visita-cargar.view-model";

const VisitaCargarScreen = () => {
  const { control, handleSubmit, cargarOrden, loading } =
    useVisitaCargarViewModel();

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View gap="$4" flex={1} paddingInline="$4">
            <H4>Vincular</H4>
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default VisitaCargarScreen;
