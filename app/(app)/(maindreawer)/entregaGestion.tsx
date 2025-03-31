import EntregaFirmaPreview from "@/components/ui/entrega/entregaFirmaPreview";
import EntregaImagenesPreview from "@/components/ui/entrega/entregaImagenesPreview";
import { EntregaSincronizar } from "@/components/ui/entrega/entregaSincronizar";
import Volver from "@/components/ui/navegacion/volver";
import { Entrega } from "@/interface/entrega/entrega";
import { RootState } from "@/store/reducers";
import { Trash2 } from "@tamagui/lucide-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Button, Card, H4, Text, View, XStack } from "tamagui";

export default function entregaGestion() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const arrEntregas = useSelector(
    (state: RootState) =>
      state.entregas.entregas.filter(
        (entrega: Entrega) =>
          entrega.estado_entregado === true &&
          entrega.estado_sincronizado === false
      ) || [],
    shallowEqual
  );
  const router = useRouter();
  

  useEffect(() => {
    // Aquí puedes realizar lógica de inicialización si es necesario.
    navigation.setOptions({
      headerLeft: () => <Volver ruta="entrega" />,
      headerRight: () => <EntregaSincronizar />
    });
  }, [navigation]);

  const retirarGestion = (item: Entrega, id: number) => { 
    // item.guias.map((guias) => {
    //   dispatch(cambiarEstadoEntrega(guias));
    //   dispatch(quitarEntregaSeleccionada(guias));
    //   dispatch(cambiarEstadoSeleccionado(guias));
    // });
    // dispatch(quitarEntregaGestion(id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView>
        <FlatList
          data={arrEntregas}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={() => (
            <XStack justify="space-between" px="$3" mb="$2">
              <H4 mb="$2">Visitas</H4>
            </XStack>
          )}
          renderItem={({ item, index }) => (
            <Card p="$3" mx="$3">
              <XStack justify={"space-between"}>
                <Text>Guias</Text>
                <Button
                  icon={<Trash2 size="$2" color={"$red10"} />}
                  variant="outlined"
                  theme={"red"}
                  onPress={() => retirarGestion(item, index)}
                ></Button>
              </XStack>
              <Text>Destinatario: {item.destinatario}</Text>
              <Text>Destinatario dirección:</Text>
              <Text>{item.destinatario_direccion}</Text>
              <Text>Imagenes</Text>
              {item.arrImagenes ? (
                <EntregaImagenesPreview
                  arrImagenes={item.arrImagenes}
                ></EntregaImagenesPreview>
              ) : (
                <Text>No registra imagenes</Text>
              )}
              <Text>Firma</Text>

              {item.firmarBase64 !== null ? (
                <EntregaFirmaPreview
                  imagen={item.firmarBase64}
                ></EntregaFirmaPreview>
              ) : (
                <Text>No registra firma</Text>
              )}
            </Card>
          )}
          ItemSeparatorComponent={() => <View my={"$2"}></View>}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
