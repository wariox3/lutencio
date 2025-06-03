import { RootState } from "@/src/application/store";
import React from "react";
import { useSelector } from "react-redux";
import { AlertDialog, Button, XStack, YStack } from "tamagui";
import { useAlertaGlobal } from "../../hooks/useAlertaGlobal";


const AlertDialogGlobal = () => {
  const { visible, titulo, mensaje } = useSelector((state: RootState) => state.alertaGlobal)
  const { aceptar, cancel } = useAlertaGlobal()

  return (
    <AlertDialog open={visible} onOpenChange={(v) => !v && cancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          p={"$4"}
        >
          <YStack gap="$4">
            <AlertDialog.Title  style={{fontSize: 22}}>{titulo}</AlertDialog.Title>
            <AlertDialog.Description>{mensaje}</AlertDialog.Description>
            <XStack gap="$3" justify="flex-end">
              <Button onPress={cancel}>Cancelar</Button>
              <Button theme="blue" onPress={aceptar}>
                Aceptar
              </Button>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default AlertDialogGlobal;
