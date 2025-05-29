import ControlUbicacion from "@/src/modules/home/presentation/components/control-ubicacion";
import ContenedorImagenBackground from "@/src/shared/components/comun/contendor-imagen-brackground";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import OrdenEntregaInformacion from "../components/orden-entrega-informacion";

export default function HomeScreen() {
  return (
      <ContenedorImagenBackground source={require("@/assets/images/fondo-app-con-logo.png")}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <OrdenEntregaInformacion></OrdenEntregaInformacion>
          <ControlUbicacion></ControlUbicacion>
        </ScrollView>
      </ContenedorImagenBackground>
  );
}
