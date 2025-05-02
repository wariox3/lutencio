import Titulo from "@/components/ui/comun/Titulo";
import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import { PasswordInput } from "@/components/ui/form/inputs/PasswordInput";
import MensajeModoPrueba from "@/components/ui/login/MensajeModoPrueba";
import ModoPruebaSheet from "@/components/ui/login/ModoPruebaSheet";
import { Validaciones } from "@/constants/mensajes";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ScrollView, Spinner, View, XStack } from "tamagui";
import { useLoginViewModel } from "../../application/view-models/use-login.view-model";
import ReusableSheet from "@/src/shared/components/modal-sheet";
import { authStyles } from "../styles/auth.style";

export default function LoginScreen() {
  const {
    control,
    modoPrueba,
    loading,
    handleNagevarOlvideClave,
    handleNavegarRegistrarse,
    handleSubmit,
    submit,
  } = useLoginViewModel();

  return (
    <SafeAreaView style={{ flex: 1}}>
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <XStack style={{ display: 'flex', justifyContent: 'end'}}>
          <ReusableSheet
            triggerText="Configuración"
            initialSnapMode="constant"
            initialModalType={false}
            customSnapPoints={[300, 200]}
            sheetContents={(props) => <ModoPruebaSheet {...props} />}
            sheetProps={{
              animation: "quick",
              overlayStyle: { backgroundColor: "rgba(0,0,0,0.7)" },
            }}
          />
        </XStack>
        <View style={authStyles.container}>
        <Titulo texto="Ingresar" />
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
        </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}
