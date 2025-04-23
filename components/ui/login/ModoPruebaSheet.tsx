import { setModoPrueba } from '@/store/reducers/configuracionReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoreVertical, XCircle, Check as CheckIcon } from '@tamagui/lucide-icons';
import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Checkbox, CheckedState, H4, H6, Label, Sheet, XStack, YGroup } from 'tamagui';


const spModes = ["percent", "constant", "fit", "mixed"] as const;

const ModoPruebaSheet = () => {
    const [position, setPosition] = useState(0);
    const [open, setOpen] = useState(false);
    const [modal] = useState(true);
    const [snapPointsMode] = useState<(typeof spModes)[number]>("mixed");
    const snapPoints = ["100%"];

    return (
        <>
            <Button
                icon={<MoreVertical size={"$1.5"} />}
                onPress={() => setOpen(true)}
                variant="outlined"
                marginEnd={"$-0.75"}
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
}

// in general good to memoize the contents to avoid expensive renders during animations
const SheetContents = memo(({ setOpen }: any) => {
    const dispatch = useDispatch();

    const gestionModoPruebas = async (checked: boolean) => {
        dispatch(setModoPrueba(checked));
        setOpen(false);
    };

    return (
        <>
            <XStack justify="space-between" mt={'$2'}>
                <H4 mb="$2">Opciones</H4>
                <Button
                    size="$4"
                    circular
                    icon={<XCircle size="$3" color={"$red10"} />}
                    onPress={() => setOpen(false)}
                    theme={"red"}
                />
            </XStack>
            <YGroup width={"auto"} flex={1} size="$4" gap="$4">
                <YGroup.Item>
                    <XStack alignItems="center" gap="$4">
                        <Checkbox id='modoPrueba' size={'$5'} onCheckedChange={(checked) => gestionModoPruebas(checked === true)}

                        >
                            <Checkbox.Indicator>
                                <CheckIcon />
                            </Checkbox.Indicator>
                        </Checkbox>

                        <Label size={'$5'} htmlFor={'modoPrueba'}>
                            modo de prueba
                        </Label>
                    </XStack>
                </YGroup.Item>
            </YGroup>
        </>
    );
});

export default ModoPruebaSheet