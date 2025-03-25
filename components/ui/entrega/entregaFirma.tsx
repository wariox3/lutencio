import { PencilLine } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import React, { memo, useRef } from "react";
import { useWindowDimensions } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import { Button } from "tamagui";

const spModes = ["percent", "constant", "fit", "mixed"] as const;

export const EntregaFirma = ({
  onCapture,
}: {
  onCapture: (base64: string) => void;
}) => {
  const [position, setPosition] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modal] = React.useState(true);
  const [snapPointsMode] = React.useState<(typeof spModes)[number]>("fit");
  const snapPoints = ["50%", 256, 190];
 
  return (
    <>
      <Button
        icon={<PencilLine size="$2" />}
        onPress={() => setOpen(true)}
      ></Button>

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
          backgroundColor="$shadow6"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Frame>
          <SheetContentsEntregaCamara setOpen={setOpen} onCapture={onCapture} />
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

// in general good to memoize the contents to avoid expensive renders during animations
const SheetContentsEntregaCamara = memo(({ setOpen, onCapture }: any) => {
    const ref = useRef<any>();
    const {  height } = useWindowDimensions();

    const handleOK = (signature: any) => {
      onCapture( signature.split(",")[1]); 
      setOpen(false)
    };
  
    const handleEmpty = () => {
      console.log("Empty");
    };
  
    const handleClear = () => {
      console.log("clear success!");
    };
  
    // Called after end of stroke
    const handleEnd = () => {
      ref.current.readSignature();
    };
  
    // Called after ref.current.getData()
    const handleData = (data: any) => {
      console.log(data);
    };
  
    return (
      <SignatureScreen
        ref={ref}
        onEnd={handleEnd}
        onOK={handleOK}
        onEmpty={handleEmpty}
        onClear={handleClear}
        onGetData={handleData}
        autoClear={true}
        descriptionText={'Ingresa firma'}
        clearText="Limpiar"
        confirmText="Acceptar"
        style={{height: height-20}}
      />
    );
});
