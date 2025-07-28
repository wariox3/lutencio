import { useAppSelector } from "@/src/application/store/hooks";
import { comprobarFiltrosActivos, obtenerVisitasLog } from "../slice/entrega.selector";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { useState } from "react";
import { useTheme } from "tamagui";

export default function useVisitaLogViewModel() {

    const arrVisitas = useAppSelector(obtenerVisitasLog);
    const { obtenerColor } = useTemaVisual()
    const filtrosAplicados = useAppSelector(comprobarFiltrosActivos)
    const [refreshing, setRefreshing] = useState(false);
    const theme = useTheme();

    const recargarVisitas = async () => {
        return arrVisitas
    };

    return {
        arrVisitas,
        filtrosAplicados,
        obtenerColor,
        refreshing,
        recargarVisitas,
        theme
    }

}