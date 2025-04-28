import Titulo from '@/components/ui/comun/Titulo'
import { EntregaCamara } from '@/components/ui/entrega/entregaCamara'
import EntregaImagenesPreview from '@/components/ui/entrega/entregaImagenesPreview'
import { SelectInput } from '@/components/ui/form/inputs/SelectInput'
import { TextAreaInput } from '@/components/ui/form/inputs/TextAreaInput'
import APIS from '@/constants/endpoint'
import { Validaciones } from '@/constants/mensajes'
import { useEliminarEnGaleria, useGuardarEnGaleria } from '@/hooks/useMediaLibrary'
import { novedadTipo } from '@/interface/entrega/novedadTipo'
import { actualizarNovedad, agregarImagenEntrega, cambiarEstadoNovedad } from '@/store/reducers/entregaReducer'
import { obtenerEntregasSeleccionadas } from '@/store/selects/entrega'
import { consultarApi } from '@/utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Loader } from '@tamagui/lucide-icons'
import * as Network from 'expo-network'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { Button, ScrollView, Spinner, Text, View, XStack, YStack } from 'tamagui'

const valoresFormulario = {
  descripcion: "",
  novedad_tipo: "",
};
const entregaNovedad = () => {

  const { guardarArchivo } = useGuardarEnGaleria()
  const { eliminarArchivo } = useEliminarEnGaleria();
  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: valoresFormulario,
  });
  const visitasSeleccionadas = useSelector(obtenerEntregasSeleccionadas);
  const networkState = Network.useNetworkState();
  const router = useRouter();
  const dispatch = useDispatch();

  const estadoInicial: {
    arrImagenes: { uri: string }[];
    arrNovedadesTipo: novedadTipo[];
    mostrarAnimacionCargando: boolean;
    ubicacionHabilitada: boolean;
    activarCamara: boolean;
    abrirGaleria: boolean;
    exigeImagenEntrega: boolean;
    inhabilitarBtnEntrega: boolean;
    camaraTipo: string;
    fotoSeleccionada: any[];
  } = {
    arrImagenes: [],
    arrNovedadesTipo: [],
    mostrarAnimacionCargando: false,
    ubicacionHabilitada: false,
    activarCamara: false,
    abrirGaleria: false,
    exigeImagenEntrega: true,
    inhabilitarBtnEntrega: false,
    camaraTipo: "",
    fotoSeleccionada: [],
  };
  const [state, setState] = useState(estadoInicial);

  useFocusEffect(
    useCallback(() => {
      reset(valoresFormulario);
      actualizarState({
        arrImagenes: []
      })
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
    //1. guardar la foto en el celular
    const nuevaUri = await guardarArchivo(uri);
    if (!nuevaUri) {
      throw new Error("Error al guardar la imagen");
    }

    // 2. Actualizar el estado con la nueva imagen
    actualizarState({
      arrImagenes: [...state.arrImagenes, { uri: nuevaUri }], // usamos la nueva URI como ID provisional
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
      await eliminarArchivo(imagen.uri);
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
    }
  };

  const guardarNovedadTipo = async (data: { novedad_tipo: any, descripcion: string }) => {

    try {
      const networkState = await Network.getNetworkStateAsync();
      const hayConexion = networkState.isConnected && networkState.isInternetReachable;
      actualizarState({
        mostrarAnimacionCargando: true
      })

      if (!hayConexion) {
        visitasSeleccionadas.forEach((entregaId) => {
          dispatch(agregarImagenEntrega({ entregaId, imagen: { uri: state.arrImagenes[0].uri } }))
          dispatch(actualizarNovedad({ entregaId, novedad_tipo: data.novedad_tipo, novedad_descripcion: data.descripcion }))
        })
        Alert.alert(`✅ Exito`, 'Guardado localmente por falta de red');
        cambiarEntregaEstadoNovedad();
        router.navigate("/(app)/(maindreawer)/entrega");
        return;
      }

      // Si hay red, se envían las novedades al backend
      await Promise.all(
        visitasSeleccionadas.map(async (visita: number) => {
          const subdominio = await AsyncStorage.getItem("subdominio");
          await consultarApi<any>(
            APIS.ruteo.novedad,
            {
              visita,
              descripcion: data.descripcion,
              novedad_tipo: data.novedad_tipo
            },
            {
              requiereToken: true,
              subdominio: subdominio!
            }
          );
        })
      );

      cambiarEntregaEstadoNovedad()
      router.navigate("/(app)/(maindreawer)/entrega");

    } catch (error) {
      actualizarState({
        mostrarAnimacionCargando: false
      })
    } finally {
      actualizarState({ mostrarAnimacionCargando: false });
    }
  }

  const cambiarEntregaEstadoNovedad = () => {
    visitasSeleccionadas.map((visita: number) => {
      dispatch(cambiarEstadoNovedad(visita));
    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View gap="$4" flex={1} paddingInline="$4">
          <Titulo texto='Novedad'></Titulo>
          <TextAreaInput
            name="descripcion"
            control={control}
            label="Descripción"
            isRequired={true}
            placeholder="Descripción"
            rules={{
              required: Validaciones.comunes.requerido,
            }}
          ></TextAreaInput>
          <>
            {
              state.arrNovedadesTipo.length > 0 ? <>
                <SelectInput
                  name='novedad_tipo'
                  control={control}
                  label='Tipo de novedad'
                  isRequired={true}
                  placeholder='Seleccionar un tipo de novedad'
                  data={state.arrNovedadesTipo}
                  rules={{
                    required: Validaciones.comunes.requerido,
                    validate: (value: string) => value !== "" || 'Selección obligatoria'
                  }}
                />
              </> : <Loader></Loader>
            }
          </>
          <XStack justify={"space-between"}>
            <YStack>
              <Text>
                Fotografías disponibles {state.arrImagenes.length} de 1
                {state.exigeImagenEntrega ? <Text
                  // can add theme values
                  color="red"
                  paddingStart="$2"
                >
                  {' '}*
                </Text> : null}
              </Text>
                  <Text color="$red10" fontSize="$3" mt="$1">
                    {Validaciones.comunes.requerido}
                  </Text>
            </YStack>
            {state.arrImagenes.length <= 0 ? (
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