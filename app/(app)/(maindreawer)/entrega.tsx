import { Cloud, Moon, Star, Sun } from "@tamagui/lucide-icons";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { Button, Card, H4, ListItem, ScrollView, Text, View, XStack, YGroup } from "tamagui";
import { EntregaCargar } from "@/components/ui/entrega/entregaCargar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Visita } from "@/interface/entrega/visita";

export default function EntregaDreawer() {
  const navigation = useNavigation();
  const [arrVisita, setArrVisitas] = useState<Visita[]>([]);
  const [arrVisitaSeleccionada, setArrVisitaSeleccionada] = useState<number[]>([]);

  useEffect(() => {
    const obtenerVisitas = async () => {
      try {
        const visitasGuardadas = await AsyncStorage.getItem("visitas");
        if (visitasGuardadas !== null) {
          setArrVisitas(JSON.parse(visitasGuardadas)); // Convertir de JSON si es necesario
        }
      } catch (error) {
        console.error("Error al obtener visitas:", error);
      }
    };

    obtenerVisitas();
  }, []); // Se ejecuta una vez al montar el componente

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => <EntregaCargar />,
    });
  }, [navigation]);
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView>

        <FlatList
          data={arrVisita}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => 
            <XStack justifyContent="space-between" px="$3" mb="$2">
            <H4 mb="$2">Entrega</H4>
            <Button size="$3" variant="outlined">
              Outlined <Text>{arrVisitaSeleccionada.length}</Text>
            </Button>
          </XStack>
          }
          renderItem={({ item }) => (
              <Card px="$3" onPress={() => setArrVisitaSeleccionada((prev) => [...prev, item.id])}>
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
