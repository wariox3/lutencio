import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import useNetworkStatus from "@/src/shared/hooks/useNetworkStatus";
import { useCallback, useEffect } from "react";
import { PenditesService } from "../../infraestructure/services/penditente.service";
import { obtenerEntregasPendientes } from "../slice/entrega.selector";
import { cambiarEstadoSinconizado, cambiarEstadoSinconizadoError } from "../slice/entrega.slice";

export const useSincronizacionEntregas = () => {
  const entregasPendientes = useAppSelector(obtenerEntregasPendientes);
  const estaEnLinea = useNetworkStatus();
  const dispatch = useAppDispatch();

  const sinconizarTodasLasPendientes = useCallback(async () => {

    if (!estaEnLinea) return;
    const subdominio = await storageService.getItem(STORAGE_KEYS.subdominio) as string;
    if (!subdominio) return;

    for (const entrega of entregasPendientes) {
      const respuesta: boolean = await PenditesService.sincronizarPenditentes(entrega, subdominio);
      if (respuesta) {
        dispatch(cambiarEstadoSinconizado({ visitaId: entrega.id, nuevoEstado: true }));
      } else {
        dispatch(cambiarEstadoSinconizadoError({ visitaId: entrega.id, nuevoEstado: true }));
      }
    }
  }, [entregasPendientes, estaEnLinea]);

  useEffect(() => {
    const inicializar = async () => {
      await sinconizarTodasLasPendientes();
    };

    inicializar();
  }, [sinconizarTodasLasPendientes]);
};
