import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useNetworkStatus from '@/src/shared/hooks/useNetworkStatus';
import { selectEntregasConNovedad } from '../slice/entrega.selector';
import { useAppSelector } from '@/src/application/store/hooks';
import { NovedadService } from '../../infraestructure/services/novedad.service';

export const useSincronizacionNovedades = () => {
  const entregasConNovedad = useAppSelector(selectEntregasConNovedad);
  const estaEnLinea = useNetworkStatus(); // <- Estado de red (boolean)

  const sincronizarTodasLasNovedades = useCallback(async () => {
    if (!estaEnLinea) return;

    const subdominio = await AsyncStorage.getItem("subdominio");
    if (!subdominio) return;

    if (entregasConNovedad.length > 0) {
      Alert.alert(
        'Sincronizando novedades',
        `Se encontraron ${entregasConNovedad.length} novedades para sincronizar`
      );
    }

    for (const novedad of entregasConNovedad) {
      console.log('Procesando novedad:', { novedad });
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