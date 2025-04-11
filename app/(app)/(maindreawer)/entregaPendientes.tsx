import { SafeAreaView, KeyboardAvoidingView, FlatList } from "react-native";
import React, { useEffect } from "react";
import { Card, H4, Text, View, XStack } from "tamagui";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { rutasApp } from "@/constants/rutas";
import { useNavigation, useRouter } from "expo-router";
import Volver from "@/components/ui/navegacion/volver";

const EntregaPendientes = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const arrEntregas = useSelector(
    (state: RootState) =>
      state.entregas.entregas.filter(
        (entrega) =>
          entrega.estado_entregado === true &&
          entrega.estado_sincronizado === false
      ) || [],
    shallowEqual
  );

  useEffect(() => {
    // Aquí puedes realizar lógica de inicialización si es necesario.
    navigation.setOptions({
      headerLeft: () => <Volver ruta="entrega" />,
      headerTitle: "",
    });
  }, [navigation]);

  const navegarEntregaPendientes = (entregaId: number) => {
    router.navigate({
      pathname: rutasApp.entregaPendientesDetalle,
      params: { entregaId },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView>
        <FlatList
          data={arrEntregas}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={() => (
            <XStack justify="space-between" px="$3" mb="$2">
              <H4 mb="$2">Pendientes</H4>
            </XStack>
          )}
          renderItem={({ item }) => (
            <Card
              p="$3"
              mx="$3"
              onPress={() => navegarEntregaPendientes(item.id)}
            >
              <Text>Id: {item.id}</Text>
              {item.estado_error ? (
                <Text>Error: {item.mensaje_error}</Text>
              ) : null}
            </Card>
          )}
          ItemSeparatorComponent={() => <View my={"$2"}></View>}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EntregaPendientes;
