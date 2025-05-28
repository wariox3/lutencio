import { rutasApp } from "@/src/core/constants/rutas.constant";
import { useMediaLibrary } from "@/src/shared/hooks/useMediaLibrary";
import { Entrega } from "@/interface/entrega/entrega";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { AlertCircle, Trash2 } from "@tamagui/lucide-icons";
import * as FileSystem from "expo-file-system";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { Button, Card, H4, ScrollView, Text, View, XStack } from "tamagui";
import { obtenerEntregasPendientes } from "../../application/slice/entrega.selector";
import { quitarVisita } from "../../application/slice/entrega.slice";

const VisitaPendienteScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { deleteFileFromGallery, isDeleting, error } = useMediaLibrary();
  const dispatch = useAppDispatch();

  const arrEntregas = useAppSelector(obtenerEntregasPendientes);

  const navegarEntregaPendientes = (entregaId: number) => {
    router.navigate({
      pathname: rutasApp.vistaPendienteDetalle,
      params: { id: entregaId },
    });
  };

  const navegarNovedadSolucion = (visita: Entrega) => {
    router.push({
      pathname: "/modal-novedad-solucion",
      params: { id: visita.novedad_id, visita_id: visita.id },
    });
  };

  const confirmarRetirarVisita = async (visita: Entrega) => {
    Alert.alert(
      "⚠️ Advertencia",
      "Esta acción no se puede deshacer una vez completa",
      [
        {
          text: "Cancel",
        },
        {
          text: "Confirmar",
          onPress: () => retirarVisita(visita),
        },
      ]
    );
  };

  const retirarVisita = async (visita: Entrega) => {
    try {
      if (visita.arrImagenes?.length > 0) {
        for (const img of visita.arrImagenes) {
          const fileInfo = await FileSystem.getInfoAsync(img.uri);
          if (fileInfo.exists) await deleteFileFromGallery(img.uri);
        }
      }

      if (visita.firmarBase64) {
        const fileInfo = await FileSystem.getInfoAsync(visita.firmarBase64);
        if (fileInfo.exists) await deleteFileFromGallery(visita.firmarBase64);
      }
      dispatch(quitarVisita({ entregaId: visita.id }));
    } catch (error: any) {
      console.error(`❌ Error en la entrega ${visita.id}:`, error);
    }
  };

  return (
    <FlatList
      data={arrEntregas}
      keyExtractor={(_, index) => index.toString()}
      contentInsetAdjustmentBehavior="automatic"
      renderItem={({ item }) => (
        <Card
          p="$3"
          mx="$3"
          mt={"$2"}
          onPress={() => navegarEntregaPendientes(item.id)}
        >
          <XStack justify={"space-between"} gap={"$2"}>
            <View>
              <Text>Id: {item.id}</Text>
              <Text>novedad_id: {item.novedad_id}</Text>
              {item.estado_error ? (
                <Text color={"$red10"}>Error: {item.mensaje_error}</Text>
              ) : null}
              {item.estado_novedad ? (
                <Text color={"$yellow10"}>Presenta novedad</Text>
              ) : null}
            </View>
            {item.estado_error ? (
              <Button
                size="$3"
                circular
                icon={<Trash2 size="$1.5" color={"$red10"} />}
                onPress={() => confirmarRetirarVisita(item)}
                theme={"red"}
              />
            ) : null}
            {item.estado_novedad ? (
              <Button
                size="$3"
                circular
                icon={<AlertCircle size="$1.5" color={"$yellow10"} />}
                onPress={() => navegarNovedadSolucion(item)}
                theme={"yellow"}
              />
            ) : null}
          </XStack>
        </Card>
      )}
      ItemSeparatorComponent={() => <View my={"$2"}></View>}
    />
  );
};

export default VisitaPendienteScreen;
