import { useAppSelector } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import useNetworkStatus from "@/src/shared/hooks/useNetworkStatus";
import { useCallback, useEffect } from "react";
import { PenditesService } from "../../infraestructure/services/penditente.service";
import { obtenerEntregasPendientes } from "../slice/entrega.selector";

export const useSincronizacionEntregas = () => {
  const entregasPendientes = useAppSelector(obtenerEntregasPendientes);
  const estaEnLinea = useNetworkStatus();

  const sinconizarTodasLasPendientes = useCallback(async () => {    
    
    if (!estaEnLinea) return;
    const subdominio = await storageService.getItem(STORAGE_KEYS.subdominio) as string;
    if (!subdominio) return;

    for (const entrega of entregasPendientes) {
      await PenditesService.sincronizarPenditentes(entrega, subdominio);
    }
  }, [entregasPendientes, estaEnLinea]);

  useEffect(() => {
    const inicializar = async () => {
      await sinconizarTodasLasPendientes();
    };

    inicializar();
  }, [sinconizarTodasLasPendientes]);
};
