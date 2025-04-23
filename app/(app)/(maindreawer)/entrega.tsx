import BtnAcciones from "@/components/ui/comun/BtnAcciones";
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

  if (permisoLocalizacion !== "granted")
    return <EntregaSinPermisoLocalizacion></EntregaSinPermisoLocalizacion>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView>
        <FlatList
          data={arrEntregas}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={() => (
            <>
              {entregasSeleccionadas.length > 0 ? (
                <BtnAcciones visualizarCantidadSeleccionada={true} cantidadSeleccionada={entregasSeleccionadas.length}></BtnAcciones>
              ) : null}
              </>
          )}
          renderItem={({ item }) => (
            <Card
              p="$3"
              mx="$2"
              mt={"$2"}
              onPress={() => gestionEntrega(item.id)}
              bg={item.seleccionado ? "#f89e6d" : null}
            >
              <Text>ID: {item.id}</Text>
              <Text>Destinatario: {item.destinatario}</Text>
              <Text>Dirección: {item.destinatario_direccion}</Text>
              <Text>Fecha: {item.fecha}</Text>
              {item.estado_entregado ? <Text>Entregado</Text> : null}
            </Card>
          )}
          ListEmptyComponent={<EntregasSinElementos />}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
