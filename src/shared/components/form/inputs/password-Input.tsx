import { PasswordInputProps } from "@/src/shared/interface/forms";
import { Eye, EyeOff } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Pressable } from "react-native";
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
      <Label>
        {label}

        {isRequired ? (
          <Text
            // can add theme values
            color="red"
            paddingStart="$2"
          >
            {" "}
            *
          </Text>
        ) : null}
      </Label>
      <XStack items="center">
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <View style={{ position: "relative", width: "100%" }}>
              <Input
                width="100%"
                secureTextEntry={!mostrarClave}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Introduce tu contraseña"
                borderColor={error ? "$red10" : "$borderColor"}
                pr={45} // Espacio para el icono
              />
              <Pressable
                onPress={() => setMostrarClave(!mostrarClave)}
                style={{
                  position: "absolute",
                  right: 15,
                  top: "50%",
                  transform: [{ translateY: -12 }],
                }}
              >
                {mostrarClave ? <Eye size="$1.5" /> : <EyeOff size="$1.5" />}
              </Pressable>
            </View>
          )}
        />
      </XStack>
      {/* Mensaje de error fuera del XStack */}
      <Controller
        name={name}
        control={control}
        render={({ fieldState: { error } }) =>
          error ? (
            <Text color="red" mt="$2">
              {error.message}
            </Text>
          ) : (
            <></>
          )
        }
      />
    </View>
  );
};
