import APIS from "@/constants/endpoint";
import { rutasApp } from "@/constants/rutas";
import { ConsultarLista } from "@/interface/comun/consultarLista";
import { Entrega } from "@/interface/entrega/entrega";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { consultarApi } from "@/utils/api";
import { iniciarTareaSeguimientoUbicacion } from "@/utils/services/locationService";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { VerticalApiRepository } from "../../infraestructure/api/vertical-api.service";
import { setEntregas } from "../slice/entrega.slice";
import { GetListaVisitaUseCase } from "../use-cases/get-lista-visita.use-case";

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

  // useEffect(() => {
  //   // Aquí puedes realizar lógica de inicialización si es necesario.
  //   // navigation.setOptions({ TODO: entender que se esta haciendo
  //   //   headerLeft: () => <Volver ruta="entrega" />,
  //   // });
  // }, [navigation]);

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
      const respuestaApiVerticalEntrega =
        await new VerticalApiRepository().getEntregaPorCodigo(data.codigo);

      if (respuestaApiVerticalEntrega) {
        const respuestaApi = await new GetListaVisitaUseCase().execute(
          respuestaApiVerticalEntrega.despacho_id,
          false,
          respuestaApiVerticalEntrega.schema_name
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
