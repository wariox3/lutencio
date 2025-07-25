import { obtenerConfiguracionModoPrueba } from "@/src/application/selectors/configuracion.selector";
import { cambiarEstadoModoPrueba } from "@/src/application/slices/configuracion.slice";
import { useAppDispatch } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { Check as CheckIcon, XCircle } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import { Button, Checkbox, H4, Label, View, XStack } from "tamagui";



const ModoPruebaSheet = memo(() => {
  const dispatch = useAppDispatch();
  const modoPruebaActivo = useSelector(obtenerConfiguracionModoPrueba);
  const { obtenerColor } = useTemaVisual();
  const router = useRouter(); // Hook para navegación

  const gestionModoPruebas = async (checked: boolean) => {
    dispatch(cambiarEstadoModoPrueba({ nuevoEstado: true }));
    storageService.setItem(STORAGE_KEYS.modoPrueba, checked);
    router.navigate("..")
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: obtenerColor("BLANCO", "NEGRO") }}
    >
      <View px={"$4"} flex={1}>
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
