import { useAppSelector } from "@/src/application/store/hooks";
import { obtenerEntregas, obtenerEntregasPendientesOrdenadas, obtenerNovedades } from "../slice/entrega.selector";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { useEffect, useState } from "react";
import { useTheme } from "tamagui";
import { Entrega } from "../../domain/interfaces/vista.interface";

export default function useVisitaLogViewModel() {
    const todasLasVisitas = useAppSelector(obtenerEntregas);
    const { obtenerColor } = useTemaVisual();
    const [refreshing, setRefreshing] = useState(false);
    const theme = useTheme();
    
    // Estado local para los filtros
    const [filtro, setFiltro] = useState<string>("");
    
    // Estado derivado para las novedades filtradas
    const [visitasFiltradas, setVisitasFiltradas] = useState<Entrega[]>(todasLasVisitas);
    
    // Comprobar si hay filtros activos
    const hayFiltrosActivos = filtro !== "";

    // Actualizar las novedades filtradas cuando cambien los filtros o las novedades
    useEffect(() => {
        if (filtro === "") {
            // Si no hay filtros activos, mostrar todas las novedades
            setVisitasFiltradas(todasLasVisitas);
        } else {
            // Aplicar filtros con coincidencia parcial
            const valorBusqueda = filtro;
            const valorBusquedaStr = valorBusqueda.toString();
            
            const filtradas = todasLasVisitas.filter((visita) => {
                // Convertir los valores a string para buscar coincidencias parciales
                const guiaStr = visita.guia?.toString() || '';
                const numeroStr = visita.numero?.toString() || '';
                
                // Buscar si el valor de búsqueda está contenido en alguno de los campos
                const coincideGuia = guiaStr.includes(valorBusquedaStr);
                const coincideNumero = numeroStr.includes(valorBusquedaStr);
                
                return coincideGuia || coincideNumero;
            });
            
            setVisitasFiltradas(filtradas);
        }
    }, [filtro, todasLasVisitas]);

    const recargarVisitas = async () => {
        return visitasFiltradas;
    };

    const actualizarFiltros = (nuevosFiltros: string) => {
        setFiltro(nuevosFiltros);
    };

    return {
        arrVisitas: visitasFiltradas,
        filtrosAplicados: hayFiltrosActivos,
        obtenerColor,
        refreshing,
        recargarVisitas,
        theme,
        actualizarFiltros
    };
}