import { EntregaCamara } from "@/components/ui/entrega/entregaCamara";
import EntregaImagenesPreview from "@/components/ui/entrega/entregaImagenesPreview";
import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { H4, ScrollView, Text, View, XStack } from "tamagui";

const entregaFormulario = () => {
  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      Recibe: "",
      parentesco: "",
      numeroIdentificacion: "",
      celular: "",
    },
  });

  const [state, setState] = useState<{
    arrImagenes: { base64: string }[];
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
  }>({
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
  });

  const actualizarState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const handleCapture = (base64: string) => {
    actualizarState({
      arrImagenes: [...state.arrImagenes, { base64 }], // 🔹 Agrega la imagen también en arrImagenes
    });
  };

  const RemoverFoto = (indexArrImagen: number) => {
    const arrImagenTemporal = state.arrImagenes.filter((item, index) => {
      return index !== indexArrImagen;
    });
    actualizarState({
      arrImagenes: arrImagenTemporal, // 🔹 Agrega la imagen también en arrImagenes
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View gap="$4" flex={1} paddingInline="$4">
          <H4 mt="$2">Entrega</H4>
          <XStack justify={'space-between'}>
          <Text>
            Fotografías disponibles {state.arrImagenes.length} de 5
            {state.exigeImagenEntrega ? <Text> Requerido * </Text> : null}
          </Text>
          <EntregaCamara onCapture={handleCapture}></EntregaCamara>
          </XStack>

          <EntregaImagenesPreview
            arrImagenes={state.arrImagenes}
            removerFoto={RemoverFoto}
          ></EntregaImagenesPreview>
          <BasicInput
            name="Recibe"
            control={control}
            label="Correo"
            isRequired={false}
            placeholder="Persona que recibe el paquete"
          />
          <BasicInput
            name="numeroIdentificacion"
            control={control}
            label="Numero identificación"
            isRequired={false}
            placeholder="000000"
          />
          <BasicInput
            name="parentesco"
            control={control}
            label="Parentesco"
            isRequired={false}
            placeholder="Padre, madre, hijo, ..."
          />
          <BasicInput
            name="celular"
            control={control}
            label="Celular"
            isRequired={false}
            keyboardType="numeric"
            placeholder="000000"
          />

          <Text>
            Firma
            {state.exigeFirmaEntrega ? <Text> Requerido * </Text> : null}
          </Text>
        </View>
        {/* <View>
            {arrImagenes ? (
              <FlatList
                snapToInterval={width - 65}
                horizontal
                data={arrImagenes}
                renderItem={({item, index}) => (
                  <ImageBackground
                    source={{uri: `data:image/jpeg;base64,${item.base64}`}}
                    imageStyle={{borderRadius: 15}}
                    style={{
                      height: item.base64 ? 180 : 0,
                      width: width - 110,
                      marginVertical: item.base64 ? 5 : 0,
                      alignItems: 'flex-end',
                      marginRight: 20,
                    }}>
                    <TouchableOpacity onPress={() => removerFoto(index)}>
                      <Ionicons
                        name="close"
                        size={20}
                        style={[
                          {
                            color: colores.rojo[500],
                            padding: 10,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : null}
          </View>*/}
      </ScrollView>
    </SafeAreaView>
  );
};

export default entregaFormulario;
