import { RootState } from "@/store/reducers";
import {
  cambiarEstadoSeleccionado,
  limpiarEntregaSeleccionada,
} from "@/store/reducers/entregaReducer";
import {
  ClipboardPlus,
  ClipboardX,
  FileStack,
  FileUp,
  FileX,
  MoreVertical,
  XCircle,
} from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, H4, H6, ListItem, XStack, YGroup } from "tamagui";

const spModes = ["percent", "constant", "fit", "mixed"] as const;

export const EntregaOpciones = () => {
  const entregasSeleccionadas = useSelector(
    (state: RootState) => state.entregas.entregasSeleccionadas || []
  );
  const entregasGestion = useSelector(
    (state: RootState) => state.entregas.gestion || []
  );
  const [position, setPosition] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modal] = React.useState(true);
  const [snapPointsMode] = React.useState<(typeof spModes)[number]>("mixed");
  const snapPoints = ["100%"];

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
          <SheetContents {...{ setOpen, entregasSeleccionadas, entregasGestion }} />
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

// in general good to memoize the contents to avoid expensive renders during animations
const SheetContents = memo(({ setOpen, entregasSeleccionadas, entregasGestion }: any) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const navegarEntregaCargar = () => {
    router.push("/(app)/(maindreawer)/entregaCargar");
    setOpen(false);
  };

  const retirarSeleccionadas = () => {
    setOpen(false);
    entregasSeleccionadas.map((entrega: number) => {
      dispatch(cambiarEstadoSeleccionado(entrega));
    });
    dispatch(limpiarEntregaSeleccionada());
  };

  return (
    <>
      <XStack justify="space-between">
        <H4 mb="$2">Opciones</H4>
        <Button
          size="$4"
          circular
          icon={<XCircle size="$3" />}
          onPress={() => setOpen(false)}
        />
      </XStack>
      <YGroup width={"auto"} flex={1} size="$4" gap="$4">
        <H6>Despacho</H6>

        <YGroup.Item>
          <ListItem
            hoverTheme
            icon={<ClipboardPlus size="$2" />}
            title="Cargar"
            subTitle="obtener información de un despacho"
            onPress={() => navegarEntregaCargar()}
          />
          <ListItem
            hoverTheme
            icon={<ClipboardX size="$2" />}
            title="Retirar"
            subTitle="Retire el despacho actual"
          />

          {entregasSeleccionadas.length > 0 ? (
            <>
              <H6 mb="$2">Seleccionadas</H6>
              <ListItem
                hoverTheme
                icon={<FileX size="$2" />}
                title="Retirar seleccionados"
                subTitle="Retirar todos los elementos seleccionados"
                onPress={() => retirarSeleccionadas()}
              />
            </>
          ) : null}

          {entregasGestion.length > 0 ? (
            <>
              <H6 mb="$2">Gestión</H6>
              <ListItem
                hoverTheme
                icon={<FileStack size="$2" />}
                title="Gestiones"
                subTitle="Ver información de las gestiones hechas"
              />
              <ListItem
                hoverTheme
                icon={<FileUp size="$2" />}
                title="Sincronizar"
                subTitle="Cargar a la nube las gestiones realizadas"
              />
            </>
          ) : null}
        </YGroup.Item>
      </YGroup>
    </>
  );
});
