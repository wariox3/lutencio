import { SelectInputProps } from "@/interface/forms/SelectInputProps";
import { Picker } from '@react-native-picker/picker';
import { useRef } from "react";
import { Controller } from "react-hook-form";
import { Label, Text, View } from "tamagui";

export const SelectInput: React.FC<SelectInputProps> = ({
    name,
    control,
    rules,
    placeholder,
    label,
    isRequired = false,
    data = [],
}) => {

    const pickerRef = useRef<any>();

    const open = () => {
        pickerRef.current.focus();
    }

    const close = () => {
        pickerRef.current.blur();
    }

    return (
        <View>
            <Label>
                {label}
                {isRequired && (
                    <Text color="red" paddingStart="$2">
                        *
                    </Text>
                )}
            </Label>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <>
                        <Picker
                            ref={pickerRef}
                            selectedValue={value}
                            onValueChange={(itemValue, itemIndex) => {   
                                onChange(parseInt(itemValue))
                            }
                            }>
                            <Picker.Item label={placeholder} value={'0'} />
                            {
                                data.map((item: any, i: number) =>
                                    <Picker.Item key={item.id} label={item.nombre} value={item.id} />
                                )
                            }
                        </Picker>
                        {error && <Text color="red">{error.message}</Text>}
                    </>
                )}
            />
        </View>
    );
};
