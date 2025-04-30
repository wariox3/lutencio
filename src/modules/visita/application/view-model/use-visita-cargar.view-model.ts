import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import storageService from "@/src/core/services/storage.service";
import { STORAGE_KEYS } from "@/src/core/constants";
import { setEntregas } from "../slice/entrega.slice";
import { iniciarTareaSeguimientoUbicacion } from "@/utils/services/locationService";
import { consultarApi } from "@/utils/api";
import APIS from "@/constants/endpoint";
import { VerticalEntrega } from "@/interface/entrega/verticalEntrega";
import { ConsultarLista } from "@/interface/comun/consultarLista";
import { Entrega } from "@/interface/entrega/entrega";
import { rutasApp } from "@/constants/rutas";

export default function useVisitaCargarViewModel() {
  const [mostrarAnimacionCargando, setMostrarAnimacionCargando] =
    useState(false);

  const valoresFormularioCargar = {
    codigo: "",
  };
  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: valoresFormularioCargar,
  });

  const navigation = useNavigation();

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Aquí puedes realizar lógica de inicialización si es necesario.
    // navigation.setOptions({ TODO: entender que se esta haciendo
    //   headerLeft: () => <Volver ruta="entrega" />,
    // });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      reset(valoresFormularioCargar);
      setMostrarAnimacionCargando(false);
    }, [])
  );

  const cargarOrden = async (data: FieldValues) => {
    setMostrarAnimacionCargando(true);
    reset({
      codigo: "",
    });
    try {
      // TODO: Conectar con el thunk y refactorizar
      const respuestaApiVerticalEntrega = await consultarApi<VerticalEntrega>(
        `${APIS.entrega.verticalEntrega}${data.codigo}/`,
        null,
        { requiereToken: true, method: "get" }
      );
      if (respuestaApiVerticalEntrega) {
        const respuestaApi = await consultarApi<ConsultarLista<Entrega>>(
          APIS.general.funcionalidadLista,
          {
            modelo: "RutVisita",
            filtros: [
              {
                propiedad: "despacho_id",
                valor1: respuestaApiVerticalEntrega.despacho_id,
                operador: "exact",
              },
              {
                propiedad: "estado_entregado",
                operador: "exact",
                valor1: false,
              },
            ],
          } as any,
          {
            requiereToken: true,
            subdominio: respuestaApiVerticalEntrega.schema_name,
          }
        );

        if (respuestaApi.registros.length > 0) {
          await storageService.setItem(
            STORAGE_KEYS.subdominio,
            respuestaApiVerticalEntrega.schema_name
          );
          await storageService.setItem(
            STORAGE_KEYS.despacho,
            `${respuestaApiVerticalEntrega.despacho_id}`
          );
          await storageService.setItem(
            STORAGE_KEYS.ordenEntrega,
            `${data.codigo}`
          );

          dispatch(setEntregas(respuestaApi.registros));
          await iniciarTareaSeguimientoUbicacion();
        }
        router.navigate(rutasApp.visitas);
      }
    } catch (error) {
      setMostrarAnimacionCargando(false);
    }
  };

  return { control, handleSubmit, mostrarAnimacionCargando, cargarOrden };
}
