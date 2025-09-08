import { MenuItem } from "@/src/core/constants";

export interface CustomDrawerContentItemProps  {
  name: string;
  item: MenuItem;
  onPress: () => void;
};
