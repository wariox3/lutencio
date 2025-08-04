import { configuracionThunk } from "@/src/application/slices/configuracion.thunk";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { cargarOrdenThunk } from "../slice/visita.thunk";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { ApiErrorResponse } from "@/src/core/api/domain/interfaces/api.interface";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import { alertas } from "@/src/core/constants";
import useNetworkStatus from "@/src/shared/hooks/useNetworkStatus";
import { cleanNovedades } from "@/src/modules/novedad/application/store/novedad.slice";
import { selectCantidadNovedadesConErrorTemporal } from "@/src/modules/novedad/application/store/novedad.selector";
import { selectCantidadVisitasConErrorTemporal } from "../slice/entrega.selector";

export default function useVisitaCargarViewModel() {
  const valoresFormularioCargar = {
    codigo: "",
  };
  const { loading } = useAppSelector(({ entregas }) => entregas);
  const { obtenerColor } = useTemaVisual();
  const estaEnLinea = useNetworkStatus();
  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: valoresFormularioCargar,
  });
  const router = useRouter();
  const cantidadNovedadesErrorTemporal = useAppSelector(
    selectCantidadNovedadesConErrorTemporal
  );
  const cantidadEntregasErrorTemporal = useAppSelector(
    selectCantidadVisitasConErrorTemporal
  );
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      reset(valoresFormularioCargar);
    }, [])
  );

  const cargarOrden = async (data: FieldValues) => {
    if (cantidadNovedadesErrorTemporal + cantidadEntregasErrorTemporal > 0) {
      mostrarAlertHook({
        titulo: "Error",
        mensaje: "No se puede cargar una orden de entrega con pendientes por sincronizar",
        onAceptar: () => {},
      });
      return;
    }

    Keyboard.dismiss();
    reset({
      codigo: "",
    });
    if (estaEnLinea) {
      try {
        const respuesta = await dispatch(
          cargarOrdenThunk({ codigo: data.codigo })
        ).unwrap();

        await dispatch(configuracionThunk()).unwrap();

        if (respuesta) {
          dispatch(cleanNovedades());
          router.replace(rutasApp.visitas);
        }
      } catch (error: any) {
        const errorParseado = error as ApiErrorResponse;
        mostrarAlertHook({
          titulo: errorParseado.titulo,
          mensaje: alertas.mensaje.ordenEntregaError404,
        });
      }
    } else {
      mostrarAlertHook({
        titulo: alertas.titulo.error,
        mensaje: alertas.mensaje.sinConexionInternet,
      });
    }
  };

  return { control, handleSubmit, loading, cargarOrden, obtenerColor };
}
