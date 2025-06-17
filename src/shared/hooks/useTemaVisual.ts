import COLORES from "@/src/core/constants/colores.constant";
import { useColorScheme } from "react-native";

type ClaveColor = keyof typeof COLORES;

export function useTemaVisual() {
  const esquemaActual: "light" | "dark" = useColorScheme() ?? "light";


  const obtenerColor = (
    claro: ClaveColor,
    oscuro: ClaveColor
  ) => COLORES[esquemaActual === "light" ? claro : oscuro];

  return {
    esquemaActual,
    esOscuro: esquemaActual === "dark",
    esClaro: esquemaActual === "light",
    obtenerColor,
  } as const;
}