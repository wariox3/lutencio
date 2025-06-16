import { useAppSelector } from '@/src/application/store/hooks';
import { STORAGE_KEYS } from '@/src/core/constants';
import storageService from '@/src/core/services/storage.service';
import useNetworkStatus from '@/src/shared/hooks/useNetworkStatus';
import { useCallback, useEffect } from 'react';
import { NovedadService } from '../../infraestructure/services/novedad.service';
import { selectEntregasConNovedad } from '../slice/entrega.selector';

export const useSincronizacionNovedades = () => {
  const entregasConNovedad = useAppSelector(selectEntregasConNovedad);
  const estaEnLinea = useNetworkStatus();
  
  const sincronizarTodasLasNovedades = useCallback(async () => {

    const subdominio = await storageService.getItem(STORAGE_KEYS.subdominio) as string;
    if (!subdominio) return;

    for (const novedad of entregasConNovedad) {
      await NovedadService.sincronizarNovedad(novedad, subdominio);
    }
  }, [entregasConNovedad, estaEnLinea]);

  useEffect(() => {
    const inicializar = async () => {
      await sincronizarTodasLasNovedades();
    };

    inicializar();
  }, [sincronizarTodasLasNovedades]);
};