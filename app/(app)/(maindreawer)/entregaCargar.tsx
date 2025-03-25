import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import APIS from "@/constants/endpoint";
import { Validaciones } from "@/constants/mensajes";
import { ConsultarLista } from "@/interface/comun/consultarLista";
import { Entrega } from "@/interface/entrega/entrega";
import { VerticalEntrega } from "@/interface/entrega/verticalEntrega";
import { setEntregas } from "@/store/reducers/entregaReducer";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { Button, H4, Spinner, View } from "tamagui";

const entregaCargar = () => {
  const [mostrarAnimacionCargando, setMostrarAnimacionCargando] =
    useState(false);
  const { control, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      codigo: "",
    },
  });
  const router = useRouter();
  const dispatch = useDispatch();


  const onLoginPressed = async (data: { codigo: string }) => {
    setMostrarAnimacionCargando(true);
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
            subdomino: respuestaApiVerticalEntrega.schema_name,
          }
        );
        // await AsyncStorage.setItem(
        //   "visitas",
        //   JSON.stringify(respuestaApi.registros)
        // );
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
