import { obtenerConfiguracionModoPrueba } from "@/src/application/selectors/configuracion.selector";
import { setModoPrueba } from "@/src/application/slices/configuracion.slice";
import { useAppDispatch } from "@/src/application/store/hooks";
import { Check as CheckIcon, XCircle } from "@tamagui/lucide-icons";
import React, { memo } from "react";
import { SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import { Button, Checkbox, H4, Label, View, XStack } from "tamagui";

interface ModoPruebaSheetProps {
  close: () => void;
  // Agrega otras props que necesites
}

const ModoPruebaSheet = memo(({ close }: ModoPruebaSheetProps) => {
  const dispatch = useAppDispatch();
  const modoPruebaActivo = useSelector(obtenerConfiguracionModoPrueba);

  const gestionModoPruebas = async (checked: boolean) => {
    dispatch(setModoPrueba(checked));
    close(); // Esto cerrará el sheet
  };

  return (
    <SafeAreaView>
      <View mt={"$2"} p={"$4"}>
        <XStack justify="space-between">
          <H4 mb="$2">Opciones</H4>
          <Button
            size="$4"
            circular
            icon={<XCircle size="$3" color={"$red10"} />}
            onPress={() => close()}
            theme={"red"}
          />
        </XStack>
        <XStack alignItems="center" gap="$4">
          <Checkbox
            id="modoPrueba"
            size={"$5"}
            checked={modoPruebaActivo}
            onCheckedChange={(checked) => gestionModoPruebas(checked === true)}
          >
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox>
          <Label size={"$5"} htmlFor={"modoPrueba"}>
            Modo de prueba
          </Label>
        </XStack>
      </View>
    </SafeAreaView>
  );
});

export default ModoPruebaSheet;
