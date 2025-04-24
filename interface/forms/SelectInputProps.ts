import { Control, FieldValues } from "react-hook-form";
import { SelectProps } from "tamagui";

export interface SelectInputProps extends SelectProps  {
  name: string;
  isRequired: boolean;
  control: Control<FieldValues, any>;
  rules?: {
    required?: string | boolean;
    pattern?: { value: RegExp; message: string };
  };
  placeholder?: string;
  label: string;
  data: any
}