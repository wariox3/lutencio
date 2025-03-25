import { EntregaCamara } from "@/components/ui/entrega/entregaCamara";
import { EntregaFirma } from "@/components/ui/entrega/entregaFirma";
import EntregaFirmaPreview from "@/components/ui/entrega/entregaFirmaPreview";
import EntregaImagenesPreview from "@/components/ui/entrega/entregaImagenesPreview";
import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H4, ScrollView, Spinner, Text, View, XStack } from "tamagui";

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
      arrImagenes: [...state.arrImagenes, { base64 }],
    });
  };

  const handleFirma = (base64: string) => {
    actualizarState({
      firmarBase64: base64,
    });
  };

  const RemoverFoto = (indexArrImagen: number) => {
    const arrImagenTemporal = state.arrImagenes.filter((item, index) => {
      return index !== indexArrImagen;
    });
    actualizarState({
      arrImagenes: arrImagenTemporal,
    });
  };

  const RemoverFirma = () => {
    actualizarState({
      firmarBase64: null,
    });
  };

  const onLoginPressed = async (data: { email: string; password: string }) => {
    // setMostrarAnimacionCargando(true);
    actualizarState({
      mostrarAnimacionCargando: true,
    });
    // try {
    //   const respuestaApiLogin = await consultarApi<any>(
    //     APIS.seguridad.login,
    //     { username: data.email, password: data.password },
    //     { requiereToken: false }
    //   );

    //   setMostrarAnimacionCargando(false);
    //   dispatch(setUsuarioInformacion(respuestaApiLogin.user));
    //   await AsyncStorage.setItem("jwtToken", respuestaApiLogin.token);
    //   router.navigate("/(app)/(maindreawer)");
    // } catch (error) {
    //   setMostrarAnimacionCargando(false);
    // }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View gap="$4" flex={1} paddingInline="$4">
          <H4 mt="$2">Entrega</H4>
          <XStack justify={"space-between"}>
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

          <XStack justify={"space-between"}>
            <Text>
              Firma
              {state.exigeFirmaEntrega ? <Text> Requerido * </Text> : null}
            </Text>
            <EntregaFirma onCapture={handleFirma}></EntregaFirma>
          </XStack>
          <EntregaFirmaPreview
            imagen={state.firmarBase64}
            RemoverFirma={RemoverFirma}
          ></EntregaFirmaPreview>
          <Button
            theme="blue"
            icon={state.mostrarAnimacionCargando ? () => <Spinner /> : undefined}
            onPress={handleSubmit(onLoginPressed)}
          >
            Entregar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default entregaFormulario;
