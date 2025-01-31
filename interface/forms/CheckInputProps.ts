import { Control, FieldValues } from "react-hook-form";

export interface CheckInputProps {
  name: string;
  isRequired: boolean;
  control: Control<FieldValues, any>;
  rules?: {
    required?: string | boolean;
    pattern?: { value: RegExp; message: string };
    validate?: (value: any) => any;
  };
  label: string;
}