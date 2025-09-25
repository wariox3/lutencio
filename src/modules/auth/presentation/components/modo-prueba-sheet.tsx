import { obtenerConfiguracionModoPrueba } from "@/src/application/selectors/configuracion.selector";
import { cambiarEstadoModoPrueba } from "@/src/application/slices/configuracion.slice";
import { useAppDispatch } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { Check as CheckIcon } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { memo } from "react";
import { SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import { Button, Checkbox, H4, Label, Paragraph, XStack, YStack } from "tamagui";

const ModoPruebaSheet = memo(() => {
  const dispatch = useAppDispatch();
  const modoPruebaActivo = useSelector(obtenerConfiguracionModoPrueba);
  const { obtenerColor } = useTemaVisual();
  const router = useRouter();

  const gestionModoPruebas = async (checked: boolean) => {
    dispatch(cambiarEstadoModoPrueba({ nuevoEstado: checked }));
    storageService.setItem(STORAGE_KEYS.modoPrueba, checked);
    router.navigate("..");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: obtenerColor("BLANCO", "NEGRO") }}
    >
      <YStack flex={1} justify="center" items="center" px="$6" gap="$6">
        {/* Título */}
        <H4 fontWeight="bold" items="center">
          Configuración del modo de prueba
        </H4>

        {/* Descripción */}
        <Paragraph items="center" color="gray">
          Activa el <Paragraph fontWeight="bold">modo de prueba</Paragraph> para 
          simular la aplicación sin afectar tus datos reales.
        </Paragraph>

        {/* Toggle */}
        <XStack items="center" gap="$4">
          <Checkbox
            id="modoPrueba"
            size="$5"
            checked={modoPruebaActivo}
            onCheckedChange={(checked) => gestionModoPruebas(checked === true)}
          >
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox>
          <Label size="$5" htmlFor="modoPrueba">
            Activar
          </Label>
        </XStack>

        {/* Botón de confirmación */}
        <Button
          size="$5"
          theme={modoPruebaActivo ? "green" : "accent"}
          onPress={() => gestionModoPruebas(!modoPruebaActivo)}
        >
          {modoPruebaActivo ? "Modo de prueba activo" : "Activar modo de prueba"}
        </Button>
      </YStack>
    </SafeAreaView>
  );
});

export default ModoPruebaSheet;

