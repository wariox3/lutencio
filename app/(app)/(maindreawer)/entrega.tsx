import { EntregaOpciones } from "@/components/ui/entrega/entregaOpciones";
import EntregasSinElementos from "@/components/ui/entrega/entregasSinElementos";
import { useIntervalActivo } from "@/hooks/useIntervalActivo";
import { RootState } from "@/store/reducers";
import {
  cambiarEstadoSeleccionado,
  quitarEntregaSeleccionada,
  seleccionarEntrega,
} from "@/store/reducers/entregaReducer";
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
    (state: RootState) =>
      state.entregas.entregas
        .filter((entrega) => !entrega.estado_entregado)
        .sort((a, b) => a.orden - b.orden) || [],
    shallowEqual
  );
  const usuario_id = useSelector((state: RootState) => state.usuario.id)

  AsyncStorage.setItem("usuario_id", `${usuario_id}`);

  const entregasSeleccionadas = useSelector(
    (state: RootState) => state.entregas.entregasSeleccionadas || []
  );
  const router = useRouter();
  const [permisoLocalizacion, setPermisoLocalizacion] = useState<string | null>(
    null
  );
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

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
            keyExtractor={(_, index) => index.toString()}
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
                <Text>Destinatario: {item.destinatario}</Text>
                <Text>Dirección: {item.destinatario_direccion}</Text>
                <Text>Fecha: {item.fecha}</Text>
                {item.estado_entregado ? <Text>Entregado</Text> : null}
              </Card>
            )}
            ItemSeparatorComponent={() => <View my={"$2"}></View>}
            ListEmptyComponent={<EntregasSinElementos />}
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
