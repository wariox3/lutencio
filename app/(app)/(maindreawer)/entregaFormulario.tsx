import { EntregaCamara } from "@/components/ui/entrega/entregaCamara";
import { EntregaFirma } from "@/components/ui/entrega/entregaFirma";
import EntregaFirmaPreview from "@/components/ui/entrega/entregaFirmaPreview";
import EntregaImagenesPreview from "@/components/ui/entrega/entregaImagenesPreview";
import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import Volver from "@/components/ui/navegacion/volver";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { RootState } from "@/store/reducers";
import {
  actualizarFirmaEntrega,
  agregarImagenEntrega,
  cambiarEstadoEntrega,
  quitarEntregaSeleccionada,
  quitarImagenEntrega,
} from "@/store/reducers/entregaReducer";
import * as MediaLibrary from "expo-media-library";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Button, H4, ScrollView, Spinner, Text, View, XStack } from "tamagui";

const entregaFormulario = () => {
  const dispatch = useDispatch();
  const entregasSeleccionadas = useSelector(
    (state: RootState) => state.entregas.entregasSeleccionadas || []
  );
  const router = useRouter();
  const navigation = useNavigation();
  const { deleteFileFromGallery, isDeleting, error } = useMediaLibrary();
  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      recibe: "",
      parentesco: "",
      numeroIdentificacion: "",
      celular: "",
    },
  });

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

  useEffect(() => {
    navigation.setOptions({ headerLeft: () => <Volver ruta="entrega" /> });
    reiniciarEstadoCompleto();
  }, [entregasSeleccionadas]);

  const reiniciarEstadoCompleto = () => {
    setState(estadoInicial);
    console.log(state);

    reiniciarState();
  };

  const reiniciarState = () => {
    reset({
      recibe: "",
      parentesco: "",
      numeroIdentificacion: "",
      celular: "",
    });
  };

  const actualizarState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const handleCapture = (uri: string) => {
    actualizarState({
      arrImagenes: [...state.arrImagenes, { uri }],
    });
  };

  const handleFirma = (firma: string) => {
    actualizarState({
      firmarBase64: firma,
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

  const removerFirma = async () => {
    actualizarState({
      firmarBase64: null,
    });
  };

  const guardarEntrega = async (data: {
    recibe: string;
    parentesco: string;
    numeroIdentificacion: string;
    celular: string;
  }) => {
    try {
      actualizarState({ mostrarAnimacionCargando: true });

      // Guardar fotos en el dispositivo
      const imagenesGuardadas = await Promise.all(
        state.arrImagenes.map(async (imagen) => {
          const asset = await MediaLibrary.createAssetAsync(imagen.uri);
          return asset.uri;
        })
      );

      if (state.firmarBase64 !== null) {
        const firmaGuardada = await MediaLibrary.createAssetAsync(
          state.firmarBase64
        );
        //guardar firma
        entregasSeleccionadas.map((entregaId) => {
          dispatch(
            actualizarFirmaEntrega({
              entregaId,
              firmarBase64: firmaGuardada.uri,
            })
          );
        });
      }

      // Agregar imágenes a entregas seleccionadas
      entregasSeleccionadas.forEach((entregaId) => {
        imagenesGuardadas.forEach((uri) => {
          dispatch(agregarImagenEntrega({ entregaId, imagen: { uri } }));
        });
      });

      // Actualizar el estado de las entregas seleccionadas
      entregasSeleccionadas.forEach((entrega) => {
        dispatch(cambiarEstadoEntrega(entrega));
        dispatch(quitarEntregaSeleccionada(entrega));
      });

      // Navegar a la pantalla de entrega
      router.navigate("/(app)/(maindreawer)/entrega");
    } catch (error) {
      console.error("Error en onLoginPressed:", error);
    } finally {
      actualizarState({ mostrarAnimacionCargando: false });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View gap="$4" flex={1} paddingInline="$4">
          <H4 my="$2">Entregas</H4>
          <Text>Seleccionas: {entregasSeleccionadas.join(", ")}</Text>
          <XStack justify={"space-between"}>
            <Text>
              Fotografías disponibles {state.arrImagenes.length} de 5
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

          <BasicInput
            name="recibe"
            control={control}
            label="Recibe"
            isRequired={false}
            placeholder="Persona que recibe el paquete"
          />
          <BasicInput
            name="numeroIdentificacion"
            control={control}
            label="Numero identificación"
            isRequired={false}
            placeholder="000000"
            keyboardType="numeric"
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
            {state.firmarBase64 === null ? (
              <EntregaFirma onCapture={handleFirma}></EntregaFirma>
            ) : null}
          </XStack>
          {state.firmarBase64 !== null ? (
            <EntregaFirmaPreview
              imagen={state.firmarBase64}
              removerFirma={removerFirma}
            ></EntregaFirmaPreview>
          ) : null}

          <Button
            theme="blue"
            icon={
              state.mostrarAnimacionCargando ? () => <Spinner /> : undefined
            }
            onPress={handleSubmit(guardarEntrega)}
            mb={"$2.5"}
          >
            Entregar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default entregaFormulario;
