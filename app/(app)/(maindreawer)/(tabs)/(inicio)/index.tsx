import { View, Text, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import EntregaCardDespachoCargado from '@/components/ui/entrega/EntregaCardDespachoCargado';
import EntregaUbicacion from '@/components/ui/entrega/entregaUbicacion';

const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <EntregaCardDespachoCargado></EntregaCardDespachoCargado> */}
          {/* <EntregaUbicacion></EntregaUbicacion> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

}

export default Index