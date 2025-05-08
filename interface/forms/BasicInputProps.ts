import { Control } from "react-hook-form";
import { KeyboardType } from "react-native";

export interface BasicInputProps {
  name: string;
  isRequired: boolean;
  control: Control<any>;
  rules?: {
    required?: string | boolean;
    pattern?: { value: RegExp; message: string };
  };
  placeholder?: string;
  label: string;
  keyboardType?: KeyboardType,
  secureTextEntry?: boolean
}