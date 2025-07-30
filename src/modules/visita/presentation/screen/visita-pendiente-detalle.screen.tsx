import React from "react";
import { KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Text } from "tamagui";
import useVisitaEntregaIdViewModel from "../../application/view-model/use-visita-entrega-id.view-model";

const VisitaPendienteDetalleScreen = () => {
  const { visita } = useVisitaEntregaIdViewModel();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Card p="$3" mx="$2" mt={"$2"} gap={2}>
        <Text>Id: {visita.id}</Text>
        <Text>Despacho: {visita.despacho}</Text>
        <Text>Destinatario:</Text>
        <Text>{visita.destinatario}</Text>
        <Text>Dirección:</Text>
        <Text>{visita.destinatario_direccion}</Text>
        <Text>Fecha: {visita.fecha}</Text>
      </Card>
      <KeyboardAvoidingView></KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VisitaPendienteDetalleScreen;
