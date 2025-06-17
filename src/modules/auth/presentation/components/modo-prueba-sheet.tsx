import { obtenerConfiguracionModoPrueba } from "@/src/application/selectors/configuracion.selector";
import { setModoPrueba } from "@/src/application/slices/configuracion.slice";
import { useAppDispatch } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
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
  const { obtenerColor } = useTemaVisual();
  const gestionModoPruebas = async (checked: boolean) => {
    dispatch(setModoPrueba(checked));
    storageService.setItem(STORAGE_KEYS.modoPrueba, checked);
    close(); // Esto cerrará el sheet
  };

  return (
    <SafeAreaView
      style={{flex:1, backgroundColor: obtenerColor("BLANCO", "NEGRO") }}
    >
      <View px={"$4"} flex={1}>
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
        <XStack items="center" gap="$4">
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
