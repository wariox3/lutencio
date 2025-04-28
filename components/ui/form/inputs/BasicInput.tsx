import { BasicInputProps } from "@/interface/forms/BasicInputProps";
import { Controller } from "react-hook-form";
import { Input, Label, Text, View } from "tamagui";

export const BasicInput: React.FC<BasicInputProps> = ({
  name,
  control,
  rules,
  placeholder,
  label,
  isRequired = false,
  secureTextEntry= false,
  keyboardType = 'default'
}) => {
  return (
    <View>
      <Label>
        {label}
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
              size="$4"
              borderWidth={1}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              borderColor={error ? "$red10" : "$borderColor"} 
            />
            {error && <Text color="red">{error.message}</Text>}
          </>
        )}
      />
    </View>
  );
};
