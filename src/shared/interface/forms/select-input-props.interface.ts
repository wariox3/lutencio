import { SelectProps } from "tamagui";

export interface SelectInputProps extends SelectProps  {
  name: string;
  control: any;
  rules?: any;
  placeholder?: string;
  label: string;
  isRequired?: boolean;
  data?: SelectItem[];
}

type SelectItem = {
  id: number | string;
  nombre: string;
};