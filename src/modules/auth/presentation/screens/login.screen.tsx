import { Validaciones } from "@/src/core/constants";
import MensajeModoPrueba from "@/src/modules/auth/presentation/components/mensaje-modo-prueba";
import { BasicInput } from "@/src/shared/components/form/inputs/basic-Input";
import { PasswordInput } from "@/src/shared/components/form/inputs/password-Input";
import { SafeAreaView } from "react-native";
import {
  Button,
  Image,
  ScrollView,
  Spinner,
  Text,
  View,
  XStack,
} from "tamagui";
import { useLoginViewModel } from "../../application/view-models/use-login.view-model";
import * as Application from 'expo-application';

export default function LoginScreen() {
  const {
    control,
    modoPrueba,
    loading,
    handleNagevarOlvideClave,
    handleNavegarRegistrarse,
    handleSubmit,
    submit,
    obtenerColor,
  } = useLoginViewModel();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: obtenerColor("BLANCO", "NEGRO") }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <XStack justify={"center"}>
          <Image
            source={require("../../../../../assets/images/logocontexto.png")}
            width={150}
            height={150}
          ></Image>
        </XStack>
        <View gap="$3" flex={1} paddingInline="$4">
          {modoPrueba ? <MensajeModoPrueba></MensajeModoPrueba> : null}
          <BasicInput
            name="username"
            control={control}
            label="Correo"
            isRequired={true}
            keyboardType="email-address"
            placeholder="Introduce tu correo"
            rules={{
              required: Validaciones.comunes.requerido,
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                message: Validaciones.comunes.correoNoValido,
              },
            }}
          />
          <PasswordInput
            name="password"
            control={control}
            label="Clave"
            isRequired={true}
            rules={{
              required: Validaciones.comunes.requerido,
              minLength: {
                value: 8,
                message: Validaciones.comunes.minimoCaracteres + 8,
              },
            }}
          />
          <Button
            theme="blue"
            icon={loading ? () => <Spinner /> : undefined}
            onPress={handleSubmit(submit)}
          >
            Ingresar
          </Button>

          <Button
            theme="blue"
            variant="outlined"
            onPress={handleNavegarRegistrarse}
            chromeless
          >
            Crear cuenta
          </Button>

          <Button
            theme="blue"
            variant="outlined"
            onPress={handleNagevarOlvideClave}
            chromeless
          >
            ¿Olvidaste la contraseña?
          </Button>
          <View flex={1} items={'center'}>
            <Text fontWeight={"$1"} theme={'blue'}>V {Application.nativeApplicationVersion}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
