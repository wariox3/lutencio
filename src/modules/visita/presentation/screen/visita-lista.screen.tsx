import EntregaSinPermisoLocalizacion from "@/components/ui/entrega/entregaSinPermisoLocalizacion";
import EntregasSinElementos from "@/components/ui/entrega/entregasSinElementos";
import React from "react";
import { FlatList, SafeAreaView } from "react-native";
import { Card, Text } from "tamagui";
import useVisitaListaViewModel from "../../application/view-model/use-visita-lista.view-model";
import BtnAcciones from "@/src/shared/components/btn-acciones";
import { rutasApp } from "@/constants/rutas";

export default function VisitaListaScreen() {
  const {
    arrEntregas,
    gestionEntrega,
    permisoLocalizacion,
    entregasSeleccionadas,
  } = useVisitaListaViewModel();

  if (permisoLocalizacion !== "granted")
    return <EntregaSinPermisoLocalizacion></EntregaSinPermisoLocalizacion>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <BtnAcciones
        visualizarCantidadSeleccionada={entregasSeleccionadas.length > 0}
        cantidadSeleccionada={entregasSeleccionadas.length}
        rutaEntregar={rutasApp.visitaEntregar} 
        rutaNovedad={rutasApp.visitaNovedad} 
      ></BtnAcciones>
      <FlatList
        data={arrEntregas}
        keyExtractor={(_, index) => index.toString()}
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
    </SafeAreaView>
  );
}
