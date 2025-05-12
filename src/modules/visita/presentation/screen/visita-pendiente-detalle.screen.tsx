import { useAppSelector } from "@/src/application/store/hooks";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { obtenerVisita } from "../../application/slice/entrega.selector";
import useVisitaEntregaIdViewModel from "../../application/view-model/use-visita-entrega-id.view-model";
import Titulo from "@/components/ui/comun/Titulo";
import { Card, Text } from "tamagui";

const VisitaPendienteDetalleScreen = () => {
  const { visita } = useVisitaEntregaIdViewModel();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Titulo texto="Visita"></Titulo>
      <Card flex={0.1} my={"$1"} padding={16}>
        <Text>Id: {visita.id}</Text>
        <Text>Despacho: {visita.despacho_id}</Text>
        <Text>Despacho: {visita.despacho_id}</Text>
        <Text>Destinatario: {visita.destinatario}</Text>
        <Text>Dirección: {visita.destinatario_direccion}</Text>
        <Text>Fecha: {visita.fecha}</Text>
      </Card>
      <KeyboardAvoidingView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VisitaPendienteDetalleScreen;
