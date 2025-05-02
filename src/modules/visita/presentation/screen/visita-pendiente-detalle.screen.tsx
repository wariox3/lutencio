import { useAppSelector } from "@/src/application/store/hooks";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { shallowEqual } from "react-redux";
import { Card, H4, Text, View, XStack } from "tamagui";

const VisitaPendienteDetalleScreen = () => {
  const navigation = useNavigation();
  const { entregaId } = useLocalSearchParams();

  const entregaIdNumber = Array.isArray(entregaId)
    ? parseInt(entregaId[0])
    : parseInt(entregaId);

  const arrEntregas = useAppSelector(
    ({ entregas }) =>
      entregas.entregas.filter(
        (entrega) =>
          entrega.estado_entregado === true &&
          entrega.estado_sincronizado === false &&
          entrega.id === entregaIdNumber
      ) || [],
    shallowEqual
  );

  useEffect(() => {
    // Aquí puedes realizar lógica de inicialización si es necesario.
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView>
        <FlatList
          data={arrEntregas}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={() => (
            <XStack justify="space-between" px="$3" mb="$2">
              <H4 mb="$2">Guía</H4>
            </XStack>
          )}
          renderItem={({ item }) => (
            <Card p="$3" mx="$3">
              <Text>Id: {item.id}</Text>
              <Text>Despacho: {item.despacho_id}</Text>
              <Text>Despacho: {item.despacho_id}</Text>
              <Text>Destinatario: {item.destinatario}</Text>
              <Text>Dirección: {item.destinatario_direccion}</Text>
              <Text>Fecha: {item.fecha}</Text>
            </Card>
          )}
          ItemSeparatorComponent={() => <View my={"$2"}></View>}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VisitaPendienteDetalleScreen;
