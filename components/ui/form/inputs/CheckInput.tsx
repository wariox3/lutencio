import { CheckInputProps } from "@/interface/forms/CheckInputProps";
import { Check as CheckIcon } from "@tamagui/lucide-icons";
import React from "react";
import { Controller } from "react-hook-form";
import { Checkbox, Label, Text, View, XStack } from "tamagui";

const CheckInput: React.FC<CheckInputProps> = ({
  name,
  control,
  rules,
  label,
  isRequired = false,
}) => {
  return (
    <View mt="$4">
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
              <XStack width={300} alignItems="center" gap="$4">
                <Checkbox checked={value} onCheckedChange={onChange}>
                  <Checkbox.Indicator>
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox>

                <Label>
                  {label}{" "}
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
              </XStack>
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

export default CheckInput;
