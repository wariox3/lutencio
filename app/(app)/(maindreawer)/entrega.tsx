import { EntregaOpciones } from "@/components/ui/entrega/entregaOpciones";
import APIS from "@/constants/endpoint";
import { useIntervalActivo } from "@/hooks/useIntervalActivo";
import { Entrega } from "@/interface/entrega/entrega";
import { RootState } from "@/store/reducers";
import {
  cambiarEstadoSeleccionado,
  quitarEntregaSeleccionada,
  seleccionarEntrega,
} from "@/store/reducers/entregaReducer";
import { consultarApi } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Button, Card, H4, Text, View, XStack } from "tamagui";

export default function EntregaDreawer() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const arrEntregas = useSelector(
    (state: RootState) => state.entregas.entregas.filter((entrega) => !entrega.estado_entregado) || [],
    shallowEqual
  );
  const entregasSeleccionadas = useSelector(
    (state: RootState) => state.entregas.entregasSeleccionadas || []
  );
  const router = useRouter();
  const [permisoLocalizacion, setPermisoLocalizacion] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setPermisoLocalizacion(status);
      if (status === "granted") {
        navigation.setOptions({
          headerRight: () => <EntregaOpciones />,
        });
        // Obtener ubicación inicial
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    }

    getCurrentLocation();
  }, [navigation]);

  // Función que se ejecutará cada 30 segundos
  const obtenerUbicacion = useCallback(async () => {
    if (permisoLocalizacion === "granted") {
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        const subdominio = await AsyncStorage.getItem("subdominio");
        const despacho = await AsyncStorage.getItem("despacho");

        const respuestaApiUbicacion = await consultarApi<any>(
          APIS.ruteo.ubicacion,
          {
            despacho: despacho!,
            "latitud":currentLocation.coords.latitude,
            "longitud":currentLocation.coords.longitude
          },
          {
            requiereToken: true,
            subdominio: subdominio!,
          }
        );
      } catch (error) {
        console.error('Error al obtener ubicación:', error);
      }
    }
  }, [permisoLocalizacion]);

  // Usar el hook de intervalo cuando hay entregas pendientes
  useIntervalActivo(arrEntregas.length > 0, obtenerUbicacion);

  const gestionEntrega = (id: number) => {
    if (entregasSeleccionadas.includes(id)) {
      dispatch(quitarEntregaSeleccionada(id));
    } else {
      dispatch(seleccionarEntrega(id));
    }
    dispatch(cambiarEstadoSeleccionado(id));
  };

  const navegarFormulario = () => {
    router.push("/(app)/(maindreawer)/entregaFormulario");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {permisoLocalizacion === "granted" ? (
        <KeyboardAvoidingView>
          <FlatList
            data={arrEntregas}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
              <XStack justify="space-between" px="$3" mb="$2">
                <H4 mb="$2">Entregas</H4>
                {entregasSeleccionadas.length > 0 ? (
                  <Button
                    size="$3"
                    variant="outlined"
                    onPress={() => navegarFormulario()}
                  >
                    seleccionadas <Text>{entregasSeleccionadas.length}</Text>
                  </Button>
                ) : null}
              </XStack>
            )}
            renderItem={({ item }) => (
              <Card
                p="$3"
                mx="$3"
                onPress={() => gestionEntrega(item.id)}
                bg={item.seleccionado ? "#2ecc71" : null}
              >
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
      ) : (
        <View px="$4">
          <H4 mb="$2">Información</H4>
          <Text mb="$4">No se cuenta con el permiso de la localización</Text>
        </View>
      )}
    </SafeAreaView>
  );
}