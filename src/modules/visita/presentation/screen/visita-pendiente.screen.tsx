import { rutasApp } from "@/constants/rutas";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { Entrega } from "@/interface/entrega/entrega";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { Trash2 } from "@tamagui/lucide-icons";
import * as FileSystem from "expo-file-system";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { shallowEqual } from "react-redux";
import { Button, Card, H4, Text, View, XStack } from "tamagui";

const VisitaPendienteScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { deleteFileFromGallery, isDeleting, error } = useMediaLibrary();
  const dispatch = useAppDispatch();

  const arrEntregas = useAppSelector(
    ({ entregas }) =>
      entregas.entregas.filter(
        (entrega) =>
          entrega.estado_entregado === true &&
          entrega.estado_sincronizado === false
      ) || [],
    shallowEqual
  );

  useEffect(() => {
    // Aquí puedes realizar lógica de inicialización si es necesario.
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  const navegarEntregaPendientes = (entregaId: number) => {
    router.navigate({
      pathname: rutasApp.vistaPendienteDetalle,
      params: { id: entregaId },
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
              <XStack justify={"space-between"} gap={"$2"}>
                <View>
                  <Text>Id: {item.id}</Text>
                  {item.estado_error ? (
                    <Text color={"$red10"}>Error: {item.mensaje_error}</Text>
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
              </XStack>
            </Card>
          )}
          ItemSeparatorComponent={() => <View my={"$2"}></View>}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VisitaPendienteScreen;
