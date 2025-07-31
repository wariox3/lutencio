import { useAppSelector } from "@/src/application/store/hooks";
import { selectAllNovedades } from "@/src/modules/novedad/application/store/novedad.selector";
import { Novedad } from "@/src/modules/novedad/domain/novedad.interface";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { useEffect, useState } from "react";
import { useTheme } from "tamagui";

export default function useVisitaNovedadLogViewModel() {
    const todasLasNovedades = useAppSelector(selectAllNovedades);
    const { obtenerColor } = useTemaVisual();
    const [refreshing, setRefreshing] = useState(false);
    const theme = useTheme();
    
    // Estado local para los filtros
    const [filtros, setFiltros] = useState<{ guia: number }>({
        guia: 0,
    });
    
    // Estado derivado para las novedades filtradas
    const [novedadesFiltradas, setNovedadesFiltradas] = useState<Novedad[]>(todasLasNovedades);
    
    // Comprobar si hay filtros activos
    const hayFiltrosActivos = filtros.guia > 0;

    // Actualizar las novedades filtradas cuando cambien los filtros o las novedades
    useEffect(() => {
        if (filtros.guia === 0) {
            // Si no hay filtros activos, mostrar todas las novedades
            setNovedadesFiltradas(todasLasNovedades);
        } else {
            // Aplicar filtros con coincidencia parcial
            const valorBusqueda = filtros.guia;
            const valorBusquedaStr = valorBusqueda.toString();
            
            const filtradas = todasLasNovedades.filter((novedad) => {
                // Convertir los valores a string para buscar coincidencias parciales
                const guiaStr = novedad.visita_id?.toString() || '';
                
                // Buscar si el valor de búsqueda está contenido en alguno de los campos
                const coincideGuia = guiaStr.includes(valorBusquedaStr);
                
                return coincideGuia;
            });
            
            setNovedadesFiltradas(filtradas);
        }
    }, [filtros, todasLasNovedades]);

    const recargarVisitas = async () => {
        return novedadesFiltradas;
    };

    const actualizarFiltros = (nuevosFiltros: { guia: number }) => {
        setFiltros(nuevosFiltros);
    };

    return {
        arrVisitas: novedadesFiltradas,
        filtrosAplicados: hayFiltrosActivos,
        obtenerColor,
        refreshing,
        recargarVisitas,
        theme,
        actualizarFiltros
    };
}