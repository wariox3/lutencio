import { EntregaOpciones } from "@/components/ui/entrega/entregaOpciones";
import EntregaSinPermisoLocalizacion from "@/components/ui/entrega/entregaSinPermisoLocalizacion";
import EntregasSinElementos from "@/components/ui/entrega/entregasSinElementos";
import { rutasApp } from "@/constants/rutas";
import { RootState } from "@/store/reducers";
import {
  cambiarEstadoSeleccionado,
  quitarEntregaSeleccionada,
  seleccionarEntrega,
} from "@/store/reducers/entregaReducer";
import {
  obtenerEntregasPendientesOrdenadas,
  obtenerEntregasSeleccionadas,
} from "@/store/selects/entrega";
import { obtenerUsuarioId } from "@/store/selects/usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, H4, Text, View, XStack } from "tamagui";

export default function EntregaDreawer() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const router = useRouter();
  const arrEntregas = useSelector(obtenerEntregasPendientesOrdenadas);
  const usuario_id = useSelector(obtenerUsuarioId);
  const entregasSeleccionadas = useSelector(obtenerEntregasSeleccionadas);
  AsyncStorage.setItem("usuario_id", `${usuario_id}`);

  const [permisoLocalizacion, setPermisoLocalizacion] = useState<string | null>(
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
    router.push(rutasApp.entregaFormulario);
  };

  if (permisoLocalizacion !== "granted")
    return <EntregaSinPermisoLocalizacion></EntregaSinPermisoLocalizacion>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
    </SafeAreaView>
  );
}
