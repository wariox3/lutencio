import { Control, FieldValues } from "react-hook-form";

export interface PasswordInputProps {
  name: string;
  isRequired: boolean;
  control: Control<FieldValues, any>;
  rules?: {
    required?: string | boolean;
    minLength?: { value: number; message: string };
  };
  label: string;
}
