import { useAppSelector } from "@/src/application/store/hooks";
import { useLocalSearchParams } from "expo-router";
import { obtenerVisita } from "../slice/entrega.selector";

export default function useVisitaEntregaIdViewModel(){
      const { id } = useLocalSearchParams();
    
      const visitaId = Array.isArray(id) ? id[0] : id;
    
      const visita = useAppSelector(obtenerVisita(parseInt(visitaId)));

      return { visita :visita[0] };
  
}