import React from "react";
import { Button, Card, Text, View, ScrollView } from "tamagui";
import usePerfilViewModel from "../../application/view-model/use-perfil.view-model";
import { perfilStyles } from "../../stylesheet/perfil.stylesheet";
import * as Application from 'expo-application';

const acercadeScreen = () => {
  const { navegarPoliticas, navegarTerminos, navegarEliminarCuenta, auth, obtenerColor } =
    usePerfilViewModel();

  return (
    <ScrollView
      style={perfilStyles.container}
      contentInsetAdjustmentBehavior="automatic"
      bg={
        obtenerColor("BLANCO", "NEGRO")
      }
    >
      <View style={perfilStyles.wrapper}>
        <Card style={perfilStyles.profileSection}>
          <Text style={perfilStyles.title}>Información personal</Text>

          <View style={perfilStyles.profileInfo}>
            <Text style={perfilStyles.value}>Versión:</Text>
          </View>

          <View style={perfilStyles.profileInfo}>
            <Text style={perfilStyles.value}>{Application.nativeApplicationVersion}</Text>
          </View>

          <View style={perfilStyles.profileInfo}>
            <Text style={perfilStyles.value}>Build:</Text>
          </View>

          <View style={perfilStyles.profileInfo}>
            <Text style={perfilStyles.value}>{Application.nativeBuildVersion}</Text>
          </View>
        </Card>
        {/* 
        <Card style={perfilStyles.linksSection}>
          <Text style={perfilStyles.sectionTitle}>Enlaces importantes</Text>

          <Button
            theme="blue"
            onPress={() => navegarTerminos()}
            style={perfilStyles.button}
          >
            Términos de Uso
          </Button>

          <Button
            theme="blue"
            onPress={() => navegarPoliticas()}
            style={perfilStyles.button}
          >
            Políticas de Privacidad
          </Button>
          <Button
            theme="red"
            onPress={() => navegarEliminarCuenta()}
            style={perfilStyles.button}
          >
            Eliminar cuenta
          </Button>
        </Card> */}
      </View>
    </ScrollView>
  );
};

export default acercadeScreen;
