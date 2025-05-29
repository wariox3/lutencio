import { ButtonProps, SheetProps, SnapPointsMode } from "tamagui";

export interface ReusableSheetProps {
  triggerText?: string;
  triggerProps?: ButtonProps;
  sheetContents?: React.ReactNode | ((props: { close: () => void }) => React.ReactNode);
  initialSnapMode?: SnapPointsMode;
  initialModalType?: boolean;
  customSnapPoints?: (number | string)[];
  onOpenChange?: (open: boolean) => void;
  sheetProps?: Partial<SheetProps>;
}