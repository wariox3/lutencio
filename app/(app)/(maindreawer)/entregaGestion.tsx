import EntregaFirmaPreview from "@/components/ui/entrega/entregaFirmaPreview";
import EntregaImagenesPreview from "@/components/ui/entrega/entregaImagenesPreview";
import { EntregaOpciones } from "@/components/ui/entrega/entregaOpciones";
import { EntregaGestion } from "@/interface/entrega/entrega";
import { RootState } from "@/store/reducers";
import {
  cambiarEstadoEntrega,
  cambiarEstadoSeleccionado,
  quitarEntregaGestion,
  quitarEntregaSeleccionada,
  seleccionarEntrega,
} from "@/store/reducers/entregaReducer";
import { Trash2 } from "@tamagui/lucide-icons";
import * as Location from "expo-location";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, H4, Text, View, XStack } from "tamagui";

export default function entregaGestion() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const arrEntregas = useSelector(
    (state: RootState) => state.entregas.gestion || []
  );
  const router = useRouter();

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => <EntregaOpciones />,
  //   });
  //   async function getCurrentLocation() {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   }

  //   getCurrentLocation();
  // }, [navigation]);

  const retirarGestion = (item: EntregaGestion, id: number) => {
    item.guias.map((guias) => {
      dispatch(cambiarEstadoEntrega(guias));
      dispatch(quitarEntregaSeleccionada(guias));
      dispatch(seleccionarEntrega(guias));
    });
    dispatch(quitarEntregaGestion(id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView>
        <FlatList
          data={arrEntregas}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <XStack justify="space-between" px="$3" mb="$2">
              <H4 mb="$2">Gestión</H4>
            </XStack>
          )}
          renderItem={({ item, index }) => (
            <Card p="$3" mx="$3">
              <XStack justify={"space-between"}>
                <Text>Guias: {item.guias.join(",")}</Text>
                <Button
                  icon={<Trash2 size="$2" color={"$red10"} />}
                  variant="outlined"
                  theme={"red"}
                  onPress={() => retirarGestion(item, index)}
                ></Button>
              </XStack>

              <Text>Recibe: {item.recibe}</Text>
              <Text>Parentesco: {item.parentesco}</Text>
              <Text>Celular: {item.celular}</Text>
              <Text>Número identificación: {item.numeroIdentificacion}</Text>
              <Text>Imagenes</Text>
              <EntregaImagenesPreview
                arrImagenes={item.arrImagenes}
              ></EntregaImagenesPreview>
              <Text>Firma</Text>
              <EntregaFirmaPreview
                imagen={item.firmarBase64}
              ></EntregaFirmaPreview>
            </Card>
          )}
          ItemSeparatorComponent={() => <View my={"$2"}></View>}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
