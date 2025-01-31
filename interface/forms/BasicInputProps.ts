import { Control, FieldValues } from "react-hook-form";

export interface BasicInputProps {
  name: string;
  isRequired: boolean;
  control: Control<FieldValues, any>;
  rules?: {
    required?: string | boolean;
    pattern?: { value: RegExp; message: string };
  };
  placeholder?: string;
  label: string;
}