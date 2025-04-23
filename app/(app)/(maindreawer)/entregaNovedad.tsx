import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, Text, TextArea, View, XStack } from 'tamagui'
import { EntregaCamara } from '@/components/ui/entrega/entregaCamara'
import EntregaImagenesPreview from '@/components/ui/entrega/entregaImagenesPreview'
import Titulo from '@/components/ui/comun/Titulo'

const entregaNovedad = () => {

  const estadoInicial: {
    arrImagenes: { uri: string }[];
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

  const actualizarState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const handleCapture = (uri: string) => {
    actualizarState({
      arrImagenes: [...state.arrImagenes, { uri }],
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
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View gap="$4" flex={1} paddingInline="$4">
          <Titulo texto='Novedad'></Titulo>
          <TextArea placeholder="Descripción"  size="$5"/>
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
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default entregaNovedad