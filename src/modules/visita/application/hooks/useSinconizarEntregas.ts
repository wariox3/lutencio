import { useAppSelector } from "@/src/application/store/hooks";
import useNetworkStatus from "@/src/shared/hooks/useNetworkStatus";
import { obtenerEntregasPendientes } from "../slice/entrega.selector";
import { useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { PenditesService } from "../../infraestructure/services/penditente.service";

export const useSincronizacionEntregas = () => {
  const entregasPendientes = useAppSelector(obtenerEntregasPendientes);
  const estaEnLinea = useNetworkStatus();

  const sinconizarTodasLasPendientes = useCallback(async () => {
    if (!estaEnLinea) return;

    const subdominio = await AsyncStorage.getItem("subdominio");
    if (!subdominio) return;

    if(entregasPendientes.length > 0){
      Alert.alert(
        'Sincronizando novedades',
        `Se encontraron ${entregasPendientes.length} entregas  para sincronizar`
      );
    }

        for (const entrega of entregasPendientes) {
          await PenditesService.sincronizarPenditentes(entrega, subdominio);
        }

  }, [
    entregasPendientes,
    estaEnLinea,
  ]);

  useEffect(() => {
    const inicializar = async () => {
      await sinconizarTodasLasPendientes();
    };

    inicializar();
  }, [sinconizarTodasLasPendientes]);
};
