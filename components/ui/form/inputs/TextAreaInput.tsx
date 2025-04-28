import React from 'react'
import { BasicInputProps } from '@/interface/forms/BasicInputProps'
import { Label, Text, TextArea, View } from 'tamagui'
import { Controller } from 'react-hook-form'

export const TextAreaInput: React.FC<BasicInputProps> = ({
    name,
    control,
    rules,
    placeholder,
    label,
    isRequired = false,
}) => {
    return (
        <View>
            <Label>
                {label}
                {isRequired ? (
                    <Text
                        // can add theme values
                        color="red"
                        paddingStart="$2"
                    >
                        {' '}*
                    </Text>
                ) : null}
            </Label>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                }) => (
                    <>
                        <TextArea
                            size="$4"
                            borderWidth={1}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder={placeholder}
                            autoCapitalize="none"
                            borderColor={error ? "$red10" : "$borderColor"} 
                        />
                        {error && <Text color="red">{error.message}</Text>}
                    </>
                )}
            />
        </View>
    )
}