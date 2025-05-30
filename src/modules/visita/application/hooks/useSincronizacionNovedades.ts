import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useNetworkStatus from '@/src/shared/hooks/useNetworkStatus';
import { selectEntregasConNovedad } from '../slice/entrega.selector';
import { useAppSelector } from '@/src/application/store/hooks';
import { NovedadService } from '../../infraestructure/services/novedad.service';

export const useSincronizacionNovedades = () => {
  const entregasConNovedad = useAppSelector(selectEntregasConNovedad);
  const estaEnLinea = useNetworkStatus();
  
  const sincronizarTodasLasNovedades = useCallback(async () => {

    const subdominio = await AsyncStorage.getItem("subdominio");
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