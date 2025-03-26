import {
  ClipboardX,
  FileSearch,
  MoreVertical,
  XCircle,
} from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { Button, H4, ListItem, XStack, YGroup } from "tamagui";

const spModes = ["percent", "constant", "fit", "mixed"] as const;

export const EntregaCargar = () => {
  const [position, setPosition] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modal] = React.useState(true);
  const [snapPointsMode] = React.useState<(typeof spModes)[number]>("mixed");
  const snapPoints = ["30%", 256, 190];

  return (
    <>
      <Button icon={MoreVertical} onPress={() => setOpen(true)}></Button>

      <Sheet
        forceRemoveScrollEnabled={open}
        modal={modal}
        open={open}
        onOpenChange={setOpen}
        snapPoints={snapPoints}
        snapPointsMode={snapPointsMode}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          background="#4cafe3"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Frame p="$4" gap="$5">
          <SheetContents {...{ setOpen }} />
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

// in general good to memoize the contents to avoid expensive renders during animations
const SheetContents = memo(({ setOpen }: any) => {
  const router = useRouter();

  const navegarEntregaCargar = () => {
    router.push("/(app)/(maindreawer)/entregaCargar");
    setOpen(false);
  };

  return (
    <>
      <XStack justifyContent="space-between">
        <H4 mb="$2">Opciones</H4>
        <Button
          size="$4"
          circular
          icon={<XCircle size="$3" />}
          onPress={() => setOpen(false)}
        />
      </XStack>
      <YGroup
        bordered
        width={"auto"}
        flex={1}
        size="$4"
        style={{ backgroundColor: "white" }}
        gap="$4"
      >
        <YGroup.Item>
          <ListItem
            hoverTheme
            icon={FileSearch}
            title="Cargar"
            subTitle="obtener información de un despacho"
            onPress={() => navegarEntregaCargar()}
          />
          <ListItem
            hoverTheme
            icon={ClipboardX}
            title="Retirar"
            subTitle="Retire el despacho actual"
          />
        </YGroup.Item>
      </YGroup>
    </>
  );
});
