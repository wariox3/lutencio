import { Control } from "react-hook-form";

export interface PasswordInputProps {
  name: string;
  isRequired: boolean;
  control: Control<any>;
  rules?: {
    required?: string | boolean;
    minLength?: { value: number; message: string };
  };
  label: string;
}
