import { EntregaCargar } from "@/components/ui/entrega/entregaCargar";
import { Visita } from "@/interface/entrega/visita";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { Button, Card, H4, Text, View, XStack } from "tamagui";

export default function EntregaDreawer() {
  const navigation = useNavigation();
  const [arrEntregas, setarrEntregas] = useState<Visita[]>([]);
  const [arrEntregasSeleccionada, setarrEntregaseleccionada] = useState<
    number[]
  >([]);

  useEffect(() => {
    const obtenerEntregas = async () => {
      try {
        const entregaGuardadas = await AsyncStorage.getItem("visitas");
        if (entregaGuardadas !== null) {
          setarrEntregas(JSON.parse(entregaGuardadas)); // Convertir de JSON si es necesario
        }
      } catch (error) {
        console.error("Error al obtener visitas:", error);
      }
    };

    obtenerEntregas();
  }, []); // Se ejecuta una vez al montar el componente

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => <EntregaCargar />,
    });
  }, [navigation]);

  const gestionEntrega = (id: number) => {
    setarrEntregaseleccionada((prev) => [...prev, id]);
    setarrEntregas((prev) => prev.filter((entrega) => entrega.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView>
        <FlatList
          data={arrEntregas}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <XStack justifyContent="space-between" px="$3" mb="$2">
              <H4 mb="$2">Entregas</H4>
              {arrEntregasSeleccionada.length > 0 ? (
                <Button size="$3" variant="outlined">
                  seleccionadas <Text>{arrEntregasSeleccionada.length}</Text>
                </Button>
              ) : null}
            </XStack>
          )}
          renderItem={({ item }) => (
            <Card px="$3" onPress={() => gestionEntrega(item.id)}>
              <Text>ID: {item.id}</Text>
              <Text>Guía: {item.guia}</Text>
              <Text>Destinatario: {item.destinatario}</Text>
              <Text>Dirección: {item.destinatario_direccion}</Text>
              <Text>Fecha: {item.fecha}</Text>
              {item.estado_entregado ? <Text>Entregado</Text> : null}
            </Card>
          )}
          ItemSeparatorComponent={() => <View my={"$2"}></View>}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
