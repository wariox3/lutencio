import React from "react";
import { Card, Text } from "tamagui";
import { Entrega } from "@/interface/entrega/entrega";
import { ItemListaProps } from "../../../domain/interfaces/visita-item-lista";

const ItemLista: React.FC<ItemListaProps> = ({ visita, onPress }) => {
  return (
    <Card
      p="$3"
      mx="$2"
      mt={"$2"}
      onPress={() => onPress(visita.id)}
      bg={
        visita.seleccionado
          ? "rgba(248,158,109, 0.30)"
          : "rgba(200, 195, 195, 0.30)"
      }
    >
      <Text>ID: {visita.id}</Text>
      <Text>Destinatario: {visita.destinatario}</Text>
      <Text>Dirección: {visita.destinatario_direccion}</Text>
      <Text>Fecha: {visita.fecha}</Text>
      {visita.estado_entregado ? <Text>Entregado</Text> : null}
      {visita.estado_novedad ? <Text theme={"yellow"} px={"$0.25"}>Novedad</Text> : null}
    </Card>
  );
};

export default ItemLista;
