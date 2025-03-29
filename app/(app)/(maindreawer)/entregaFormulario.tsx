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
import { useNavigation, useRouter } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
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
    // Aquí puedes realizar lógica de inicialización si es necesario.
    navigation.setOptions({
      headerLeft: () => <Volver ruta="entrega" />,
    });
    reiniciarState();
    reset({
      recibe: "",
      parentesco: "",
      numeroIdentificacion: "",
      celular: "",
    });
  }, [navigate]);

  const reiniciarState = () => {
    setState(estadoInicial);
  };

  const actualizarState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const handleCapture = (uri: string) => {
    actualizarState({
      arrImagenes: [...state.arrImagenes, { uri }],
    });
    entregasSeleccionadas.map((entregaId) => {
      dispatch(agregarImagenEntrega({ entregaId, imagen: { uri } }));
    })
  };

  const handleFirma = (base64: string) => {
    actualizarState({
      firmarBase64: base64,
    });
    entregasSeleccionadas.map((entregaId) => {
      dispatch(actualizarFirmaEntrega({ entregaId, firmarBase64: base64 }));
    })
  };

  const removerFoto = async (indexArrImagen: number) => {
    try {
      const imagen = state.arrImagenes[indexArrImagen];
      await deleteFileFromGallery(imagen.uri);
      // Aquí deberías también actualizar tu estado para reflejar la eliminación
      const newArrImagenes = [...state.arrImagenes];
      newArrImagenes.splice(indexArrImagen, 1);
      // Suponiendo que tienes una función para actualizar el estado
      setState((prev) => ({ ...prev, arrImagenes: newArrImagenes }));
      entregasSeleccionadas.map((entregaId) => {
        dispatch(quitarImagenEntrega({ entregaId, imagenUri: imagen.uri  }));
      })
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
    }
  };

  const removerFirma = async () => {
    await deleteFileFromGallery(state.firmarBase64!);
    actualizarState({
      firmarBase64: null,
    });
    entregasSeleccionadas.map((entregaId) => {
      dispatch(actualizarFirmaEntrega({ entregaId, firmarBase64: null }));
    })
  };

  const onLoginPressed = async (data: {
    recibe: string;
    parentesco: string;
    numeroIdentificacion: string;
    celular: string;
  }) => {
    try {
      actualizarState({
        mostrarAnimacionCargando: true,
      });

      // dispatch(
      //   nuevaEntregaGestion({
      //     arrImagenes: state.arrImagenes,
      //     celular: data.celular,
      //     numeroIdentificacion: data.numeroIdentificacion,
      //     recibe: data.recibe,
      //     parentesco: data.parentesco,
      //     guias: entregasSeleccionadas,
      //     firmarBase64: state.firmarBase64,
      //   })
      // );
      entregasSeleccionadas.map((entrega) => {
        dispatch(cambiarEstadoEntrega(entrega));
        dispatch(quitarEntregaSeleccionada(entrega));
      });
      router.navigate("/(app)/(maindreawer)/entrega");
    } catch (error) {
      actualizarState({
        mostrarAnimacionCargando: false,
      });
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

          <EntregaImagenesPreview
            arrImagenes={state.arrImagenes}
            removerFoto={removerFoto}
          ></EntregaImagenesPreview>
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
          <EntregaFirmaPreview
            imagen={state.firmarBase64}
            removerFirma={removerFirma}
          ></EntregaFirmaPreview>
          <Button
            theme="blue"
            icon={
              state.mostrarAnimacionCargando ? () => <Spinner /> : undefined
            }
            onPress={handleSubmit(onLoginPressed)}
            mb={"$2"}
          >
            Entregar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default entregaFormulario;
