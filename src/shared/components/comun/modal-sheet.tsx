import React from "react";
import { Button, Sheet } from "tamagui";
import { ReusableSheetProps } from "../../interface/comun";
import { useTemaVisual } from "../../hooks/useTemaVisual";

type SnapPointsMode = "percent" | "constant" | "fit" | "mixed";
interface Props extends ReusableSheetProps {
  triggerContent?: React.ReactNode;
}

const ReusableSheet: React.FC<Props> = ({
  triggerContent,
  triggerText,
  triggerProps = {},
  sheetContents,
  initialSnapMode = "percent",
  initialModalType = true,
  customSnapPoints,
  onOpenChange,
  sheetProps = {},
}) => {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [modal, setModal] = React.useState(initialModalType);
  const [snapPointsMode, setSnapPointsMode] =
    React.useState<SnapPointsMode>(initialSnapMode);
  const [mixedFitDemo, setMixedFitDemo] = React.useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
  };

  const close = () => setOpen(false);

  const isPercent = snapPointsMode === "percent";
  const isConstant = snapPointsMode === "constant";
  const isFit = snapPointsMode === "fit";
  const isMixed = snapPointsMode === "mixed";

  const { obtenerColor } = useTemaVisual();

  const snapPoints = customSnapPoints
    ? customSnapPoints
    : isPercent
      ? [85, 50, 25]
      : isConstant
        ? [256, 190]
        : isFit
          ? undefined
          : mixedFitDemo
            ? ["fit", 110]
            : ["80%", 256, 190];

  return (
    <>
      <Button onPress={() => setOpen(true)} {...triggerProps}>
        {triggerContent ?? triggerText}
      </Button>
      <Sheet
        forceRemoveScrollEnabled={open}
        modal={modal}
        open={open}
        onOpenChange={handleOpenChange}
        snapPoints={snapPoints}
        snapPointsMode={snapPointsMode}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
        native={true}
        {...sheetProps}
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame
          style={{ flex: 1, backgroundColor: obtenerColor("BLANCO", "NEGRO") }}
        >
          {
            open ? (
              <>
                {typeof sheetContents === "function"
                  ? sheetContents({ close })
                  : sheetContents}
              </>
            ) : null
          }
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

export default ReusableSheet;
