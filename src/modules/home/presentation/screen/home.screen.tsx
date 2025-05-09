import { View, Text, KeyboardAvoidingView, ImageBackground } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import EntregaCardDespachoCargado from "@/components/ui/entrega/EntregaCardDespachoCargado";
import EntregaUbicacion from "@/components/ui/entrega/entregaUbicacion";
import BtnMenuDrawer from "@/src/shared/components/btn-menu-drewer";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={require('../../../../../assets/images/fondo-app.png')} resizeMode="cover" style={{
        flex: 1
  }}>
    <BtnMenuDrawer></BtnMenuDrawer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <EntregaCardDespachoCargado></EntregaCardDespachoCargado>
          <EntregaUbicacion></EntregaUbicacion>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
