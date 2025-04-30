import React from 'react';
import { Button, Paragraph, Sheet, XStack, YStack, SheetProps } from 'tamagui';

type SnapPointsMode = 'percent' | 'constant' | 'fit' | 'mixed';
type SheetContentsProps = {
  modal?: boolean;
  isPercent?: boolean;
  innerOpen?: boolean;
  setInnerOpen?: (open: boolean) => void;
  setOpen?: (open: boolean) => void;
};

interface ReusableSheetProps {
  triggerText?: string;
  sheetContents?: React.ReactNode | ((props: SheetContentsProps) => React.ReactNode);
  initialSnapMode?: SnapPointsMode;
  initialModalType?: boolean;
  customSnapPoints?: (number | string)[];
  onOpenChange?: (open: boolean) => void;
  sheetProps?: Partial<SheetProps>;
}

const spModes: SnapPointsMode[] = ['percent', 'constant', 'fit', 'mixed'];

const ReusableSheet: React.FC<ReusableSheetProps> = ({
  triggerText = 'Open Sheet',
  sheetContents,
  initialSnapMode = 'percent',
  initialModalType = true,
  customSnapPoints,
  onOpenChange,
  sheetProps = {},
}) => {
  const [position, setPosition] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState(initialModalType);
  const [innerOpen, setInnerOpen] = React.useState(false);
  const [snapPointsMode, setSnapPointsMode] = React.useState<SnapPointsMode>(initialSnapMode);
  const [mixedFitDemo, setMixedFitDemo] = React.useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
  };

  const cycleSnapMode = () => {
    setSnapPointsMode((prev) => {
      const currentIndex = spModes.indexOf(prev);
      const nextIndex = (currentIndex + 1) % spModes.length;
      return spModes[nextIndex];
    });
  };

  const isPercent = snapPointsMode === 'percent';
  const isConstant = snapPointsMode === 'constant';
  const isFit = snapPointsMode === 'fit';
  const isMixed = snapPointsMode === 'mixed';

  const getSnapPoints = () => {
    if (customSnapPoints) return customSnapPoints;
    
    return isPercent
      ? [85, 50, 25]
      : isConstant
      ? [256, 190]
      : isFit
      ? undefined
      : mixedFitDemo
      ? ['fit', 110]
      : ['80%', 256, 190];
  };

  const snapPoints = getSnapPoints();

  return (
    <>
      <YStack gap="$4">
        <XStack gap="$4" $maxMd={{ flexDirection: 'column', alignItems: 'center' }}>
          <Button onPress={() => setOpen(true)}>{triggerText}</Button>
        </XStack>

        {isMixed ? (
          <Button onPress={() => setMixedFitDemo((x) => !x)}>
            {`Snap Points: ${JSON.stringify(snapPoints)}`}
          </Button>
        ) : null}
      </YStack>

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
        {...sheetProps}
      >
        <Sheet.Overlay
          animation="lazy"
          backgroundColor="$shadow6"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Frame>
          {typeof sheetContents === 'function'
            ? sheetContents({ modal, isPercent, innerOpen, setInnerOpen, setOpen })
            : sheetContents}
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

export default ReusableSheet;