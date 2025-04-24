import Titulo from '@/components/ui/comun/Titulo'
import { EntregaCamara } from '@/components/ui/entrega/entregaCamara'
import EntregaImagenesPreview from '@/components/ui/entrega/entregaImagenesPreview'
import { SelectInput } from '@/components/ui/form/inputs/SelectInput'
import { TextAreaInput } from '@/components/ui/form/inputs/TextAreaInput'
import APIS from '@/constants/endpoint'
import { Entrega } from '@/interface/entrega/entrega'
import { novedadTipo } from '@/interface/entrega/novedadTipo'
import { RootState } from '@/store/reducers'
import { obtenerEntregasSeleccionadas } from '@/store/selects/entrega'
import { consultarApi } from '@/utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Loader } from '@tamagui/lucide-icons'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { Button, ScrollView, Spinner, Text, View, XStack } from 'tamagui'
import * as MediaLibrary from "expo-media-library";

const entregaNovedad = () => {

  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      descripcion: "",
      novedad_tipo: 0,
    },
  });
  const visitasSeleccionadas = useSelector(obtenerEntregasSeleccionadas);

  const estadoInicial: {
    arrImagenes: { uri: string, id: any }[];
    arrNovedadesTipo: novedadTipo[];
    mostrarAnimacionCargando: boolean;
    ubicacionHabilitada: boolean;
    activarCamara: boolean;
    abrirGaleria: boolean;
    exigeImagenEntrega: boolean;
    exigeFirmaEntrega: boolean;
    inhabilitarBtnEntrega: boolean;
    camaraTipo: string;
    firmarBase64: string | null;
    fotoSeleccionada: any[];
  } = {
    arrImagenes: [],
    arrNovedadesTipo: [],
    mostrarAnimacionCargando: false,
    ubicacionHabilitada: false,
    activarCamara: false,
    abrirGaleria: false,
    exigeImagenEntrega: false,
    exigeFirmaEntrega: false,
    inhabilitarBtnEntrega: false,
    camaraTipo: "",
    firmarBase64: null,
    fotoSeleccionada: [],
  };
  const [state, setState] = useState(estadoInicial);

  useFocusEffect(
    useCallback(() => {
      obtenerNovedadesTipo()
    }, [])
  );

  const obtenerNovedadesTipo = async () => {
    try {
      const subdominio = await AsyncStorage.getItem("subdominio");

      const respuestaApiNovedadTipo = await consultarApi<any>(
        APIS.ruteo.novedadTipo, null,
        { requiereToken: true, method: 'get', subdominio: subdominio! }
      );

      actualizarState({
        arrNovedadesTipo: respuestaApiNovedadTipo,
      });

    } catch (error) {

    }
  }

  const actualizarState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const handleCapture = async (uri: string) => {
    console.log(uri);
    // guardar la foto en el celular
    const asset = await MediaLibrary.createAssetAsync(uri);
    console.log(asset);

     actualizarState({
       arrImagenes: [...state.arrImagenes, { uri, id: asset.id }],
     });
  };

  const removerFoto = async (indexArrImagen: number) => {
    try {
      const imagen = state.arrImagenes[indexArrImagen];
      // Aquí deberías también actualizar tu estado para reflejar la eliminación
      const newArrImagenes = [...state.arrImagenes];
      newArrImagenes.splice(indexArrImagen, 1);
      // Suponiendo que tienes una función para actualizar el estado
      setState((prev) => ({ ...prev, arrImagenes: newArrImagenes }));
      await MediaLibrary.deleteAssetsAsync([imagen.id]);

    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
    }
  };

  const guardarNovedadTipo = async (data: { novedad_tipo: any }) => {
    actualizarState({
      mostrarAnimacionCargando: true
    })

    try {
      visitasSeleccionadas.map(async (visita: number) => {
        const subdominio = await AsyncStorage.getItem("subdominio");
        const respuestaApiNovedad = await consultarApi<any>(
          APIS.ruteo.novedad, {
          visita,
          novedad_tipo: data.novedad_tipo
        },
          { requiereToken: true, subdominio: subdominio! }
        );

      })
    } catch (error) {
      actualizarState({
        mostrarAnimacionCargando: false
      })
    } finally {
      actualizarState({ mostrarAnimacionCargando: false });
    }
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View gap="$4" flex={1} paddingInline="$4">
          <Titulo texto='Novedad'></Titulo>
          <TextAreaInput
            name="descripcion"
            control={control} label="Descripción"
            isRequired={true}
            placeholder="Descripción "
          ></TextAreaInput>
          <>
            {
              state.arrNovedadesTipo.length > 0 ? <>
                <SelectInput name='novedad_tipo' control={control} label='Novedad tipo' isRequired={true} placeholder='Seleccionar un tipo de novedad' data={state.arrNovedadesTipo}></SelectInput>
              </> : <Loader></Loader>
            }
          </>
          <XStack justify={"space-between"}>
            <Text>
              Fotografías disponibles {state.arrImagenes.length} de 1
              {state.exigeImagenEntrega ? <Text> Requerido * </Text> : null}
            </Text>
            {state.arrImagenes.length <= 4 ? (
              <EntregaCamara onCapture={handleCapture}></EntregaCamara>
            ) : null}
          </XStack>
          {state.arrImagenes.length > 0 ? (
            <EntregaImagenesPreview
              arrImagenes={state.arrImagenes}
              removerFoto={removerFoto}
            ></EntregaImagenesPreview>
          ) : null}
          <Button
            theme="blue"
            icon={state.mostrarAnimacionCargando ? () => <Spinner /> : undefined}
            onPress={handleSubmit(guardarNovedadTipo)}
          >
            Guardar
          </Button>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default entregaNovedad