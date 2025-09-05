import * as Application from 'expo-application';
import { Linking, Platform } from 'react-native';
import { Button, Card, Image, ScrollView, Text, View, XStack } from "tamagui";
import usePerfilViewModel from "../../application/view-model/use-acercade.view-model";
import { perfilStyles } from "../../stylesheet/acercade.stylesheet";

const acercadeScreen = () => {
  const { obtenerColor, navegarTerminos, navegarPoliticas, needsUpdate, storeUrl } =
    usePerfilViewModel();

  return (
    <ScrollView
      style={perfilStyles.container}
      contentInsetAdjustmentBehavior="automatic"
      bg={
        obtenerColor("BLANCO", "NEGRO")
      }
    >
      <XStack justify={"center"}>
        <Image
          source={require("../../../../../assets/images/logocontexto.png")}
          width={150}
          height={150}
        ></Image>
      </XStack>
      <View style={perfilStyles.wrapper}>
        <Card style={perfilStyles.profileSection}>
          <Text style={perfilStyles.title}>Ruteo.co para {Platform.OS === "ios" ? "iOS" : "Android"}</Text>

          <View style={perfilStyles.profileInfo}>
            <Text style={perfilStyles.value}>Versión:</Text>
          </View>

          <View style={perfilStyles.profileInfo}>
            <Text style={perfilStyles.value}>{Application.nativeApplicationVersion}</Text>
          </View>

        </Card>

        {needsUpdate && storeUrl !== null && (
          <Card style={perfilStyles.linksSection}>
            <Text style={perfilStyles.sectionTitle}>Enlaces importantes</Text>
            <Button
              theme="red"
              style={[perfilStyles.button, { marginTop: 10 }]}
              onPress={() => Linking.openURL(storeUrl)}
            >
              Actualizar
            </Button>
          </Card>
        )}

      </View>
    </ScrollView>
  );
};

export default acercadeScreen;
