import { PasswordInputProps } from "@/interface/forms/PasswordInputProps";
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Button, Input, Label, Text, View, XStack } from "tamagui";

export const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  control,
  rules,
  label,
  isRequired = false,
}) => {
  const [mostrarClave, setMostrarClave] = useState(false);

  return (
    <View mt="$4">
      <Label>{label}

      {isRequired ? (
          <Text
            // can add theme values
            color="red"
            paddingStart ="$2"
          >
            {' '}*
          </Text>
        ) : null}

      </Label>
      <XStack alignItems="center">
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <>
              <Input
                flex={1}
                size="$4"
                secureTextEntry={!mostrarClave}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Introduce tu contraseña"
                style={{
                  borderBottomRightRadius: 0,
                  borderTopRightRadius: 0
                }}
              />
              <Button
                icon={mostrarClave ? <Eye size="$1.5" /> : <EyeOff size="$1.5" />}
                onPress={() => setMostrarClave(!mostrarClave)}
                style={{
                  borderBottomLeftRadius: 0,
                  borderTopLeftRadius: 0
                }}
              /> 
            </>
          )}
        />
      </XStack>
      {/* Mensaje de error fuera del XStack */}
      <Controller
        name={name}
        control={control}
        render={({ fieldState: { error } }) =>
          error ? (
            <Text color="red" marginTop="$2">
              {error.message}
            </Text>
          ) : null
        }
      />
    </View>
  );
};
