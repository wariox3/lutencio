import COLORES from '@/src/core/constants/colores.constant';
import { useTemaVisual } from '@/src/shared/hooks/useTemaVisual';
import { SelectInputProps } from '@/src/shared/interface/forms';
import { Picker } from '@react-native-picker/picker';
import { Controller } from "react-hook-form";
import { Label, Text, View } from "tamagui";


export const SelectInput: React.FC<SelectInputProps> = ({
  name,
  control,
  rules,
  placeholder = 'Seleccionar',
  label,
  isRequired = false,
  data = [],
}) => {
  const { esquemaActual } = useTemaVisual()
    const isDarkMode = esquemaActual === 'dark';
    const background = isDarkMode ? COLORES.GRIS_OSCURO : COLORES.BLANCO;
    const color = isDarkMode ? COLORES.BLANCO : COLORES.NEGRO;
  return (
    <View mb="$3">
      <Label fontSize="$4" mb="$2">
        {label}
        {isRequired && (
          <Text color="$red10" paddingStart="$2">
            {' '}*
          </Text>
        )}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View>
            <View
              borderWidth={1}
              borderColor={error ? "$red10" : "$borderColor"}
              borderRadius="$2"
            >
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(itemValue)}
                style={{ color: color }}

              >
                <Picker.Item label={placeholder} value="0"  style={{ color: color, backgroundColor: background }} />
                {data.map((item) => (
                  <Picker.Item
                    key={item.id.toString()}
                    label={item.nombre}
                    value={item.id}
                    style={{ color: color, backgroundColor: background }}

                  />
                ))}
              </Picker>
            </View>

            {error && (
              <Text color="$red10" fontSize="$3" mt="$1">
                {error.message}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
};
