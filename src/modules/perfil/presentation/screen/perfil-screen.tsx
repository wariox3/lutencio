import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Button } from "tamagui";
import { useRouter } from "expo-router";
import { rutasApp } from "@/constants/rutas";
import { perfilStyles } from "../../stylesheet/perfil.stylesheet";
import usePerfilViewModel from "../../application/view-model/use-perfil.view-model";


const perfilScreen = () => {

  const { navegarPoliticas, navegarTerminos, auth } = usePerfilViewModel()

  return (
    <ScrollView style={perfilStyles.container}>
      <View style={perfilStyles.wrapper}>
        <View style={perfilStyles.profileSection}>
          <Text style={perfilStyles.title}>Perfil de Usuario</Text>
          
          {/* Aquí puedes añadir la información del perfil del usuario */}
          <View style={perfilStyles.profileInfo}>
            <Text style={perfilStyles.value}>Usuario</Text>
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
        </View>
      </View>
    </ScrollView>
  )
}

export default perfilScreen
