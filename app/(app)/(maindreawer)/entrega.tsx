import { EntregaCargar } from "@/components/ui/entrega/entregaCargar";
import { Entrega } from "@/interface/entrega/entrega";
import { RootState } from "@/store/reducers";
import { seleccionarEntrega } from "@/store/reducers/entregaReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, H4, Text, View, XStack } from "tamagui";
import * as Location from 'expo-location';

export default function EntregaDreawer() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const arrEntregas = useSelector((state: RootState) => state.entregas.entregas || []);
  const entregasSeleccionadas = useSelector((state: RootState) => state.entregas.entregasSeleccionadas || []);
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <EntregaCargar />,
    });
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, [navigation]);

  const gestionEntrega = (id: number) => {
    dispatch(seleccionarEntrega(id));
    // setarrEntregas((prev) => prev.filter((entrega) => entrega.id !== id));
  };

  const navegarFormulario = () => {
    router.push("/(app)/(maindreawer)/entregaFormulario");
    
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView>
        <FlatList
          data={arrEntregas}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <XStack justifyContent="space-between" px="$3" mb="$2">
              <H4 mb="$2">Entregas</H4>
              {entregasSeleccionadas.length > 0 ? (
                <Button size="$3" variant="outlined" onPress={() => navegarFormulario()}>
                  seleccionadas <Text>{entregasSeleccionadas.length}</Text>
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
