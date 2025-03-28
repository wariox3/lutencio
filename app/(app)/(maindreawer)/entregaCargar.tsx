import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import Volver from "@/components/ui/navegacion/volver";
import APIS from "@/constants/endpoint";
import { Validaciones } from "@/constants/mensajes";
import { ConsultarLista } from "@/interface/comun/consultarLista";
import { Entrega } from "@/interface/entrega/entrega";
import { VerticalEntrega } from "@/interface/entrega/verticalEntrega";
import { setEntregas } from "@/store/reducers/entregaReducer";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { Button, H4, Spinner, View } from "tamagui";

const entregaCargar = () => {
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
    navigation.setOptions({
      headerLeft: () => <Volver ruta="entrega" />,
    });
  }, [navigation]);

  const onLoginPressed = async (data: { codigo: string }) => {
    setMostrarAnimacionCargando(true);
    reset({
      codigo: ''
    });
    try {
      const respuestaApiVerticalEntrega = await consultarApi<VerticalEntrega>(
        `${APIS.entrega.verticalEntrega}${data.codigo}/`,
        null,
        { requiereToken: true, method: "get" }
      );
      if (respuestaApiVerticalEntrega) {
        setMostrarAnimacionCargando(false);
        const respuestaApi = await consultarApi<ConsultarLista<Entrega>>(
          APIS.general.funcionalidadLista,
          {
            modelo: "RutVisita",
            filtro: [
              {
                propiedad: "despacho_id",
                valor1: respuestaApiVerticalEntrega.despacho_id,
                operador: "exact",
              },
            ],
          } as any,
          {
            requiereToken: true,
            subdominio: respuestaApiVerticalEntrega.schema_name,
          }
        );
        await AsyncStorage.setItem(
          "subdominio",
          respuestaApiVerticalEntrega.schema_name
        );
        dispatch(setEntregas(respuestaApi.registros));
        router.navigate("/(app)/(maindreawer)/entrega");
      }
    } catch (error) {
      setMostrarAnimacionCargando(false);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View gap="$4" flex={1} paddingInline="$4">
            <H4>Cargar</H4>
            <BasicInput
              name="codigo"
              control={control}
              label="Código"
              isRequired={true}
              placeholder="Código despacho"
              rules={{
                required: Validaciones.comunes.requerido,
              }}
            />
            <Button
              theme="blue"
              icon={mostrarAnimacionCargando ? () => <Spinner /> : undefined}
              onPress={handleSubmit(onLoginPressed)}
            >
              Cargar
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default entregaCargar;
