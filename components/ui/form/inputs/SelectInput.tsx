import { SelectInputProps } from "@/interface/forms/SelectInputProps";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { useMemo, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { Adapt, Label, Select, Sheet, Text, View, YStack } from "tamagui";
import { Picker } from '@react-native-picker/picker';

export const SelectInput: React.FC<SelectInputProps> = ({
    name,
    control,
    rules,
    placeholder,
    label,
    isRequired = false,
    data = [],
}) => {

    const pickerRef = useRef();

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
                                console.log(itemValue);
                                
                                onChange(itemValue)
                            }
                              
                            }>
                                  <Picker.Item label={placeholder}  />

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
