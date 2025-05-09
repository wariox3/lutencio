import EntregaCardDespachoCargado from "@/components/ui/entrega/EntregaCardDespachoCargado";
import EntregaUbicacion from "@/components/ui/entrega/entregaUbicacion";
import BtnMenuDrawer from "@/src/shared/components/btn-menu-drewer";
import ContenedorImagenBackground from "@/src/shared/components/contendor-imagen-brackground";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ContenedorImagenBackground source={require("../../../../../assets/images/fondo-app-con-logo.png")}>
        <BtnMenuDrawer></BtnMenuDrawer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <EntregaCardDespachoCargado></EntregaCardDespachoCargado>
          <EntregaUbicacion></EntregaUbicacion>
        </ScrollView>
      </ContenedorImagenBackground>
    </SafeAreaView>
  );
}
