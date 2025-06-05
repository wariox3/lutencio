import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "tamagui";
import usePerfilViewModel from "../../application/view-model/use-perfil.view-model";
import { perfilStyles } from "../../stylesheet/perfil.stylesheet";

const perfilScreen = () => {
  const { navegarPoliticas, navegarTerminos, navegarEliminarCuenta, auth } =
    usePerfilViewModel();

  return (
    <ScrollView
      style={perfilStyles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={perfilStyles.wrapper}>
        <View style={perfilStyles.profileSection}>
          <Text style={perfilStyles.title}>Información personal</Text>

          <View style={perfilStyles.profileInfo}>
            <Text style={perfilStyles.value}>Usuario:</Text>
          </View>

          <View style={perfilStyles.profileInfo}>
            <Text style={perfilStyles.value}>{auth?.user.correo}</Text>
          </View>
        </View>

        <View style={perfilStyles.linksSection}>
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
        </View>
      </View>
    </ScrollView>
  );
};

export default perfilScreen;
