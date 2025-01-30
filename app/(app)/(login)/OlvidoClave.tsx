import {
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// import Contenedor from "@/components/common/Contenedor";
// import TextInput from "@/components/common/TextInput";
// import Button from "@/components/common/Button";
// import { validarCorreoElectronico } from "@/constants/personalidades";
import { consultarApi } from "@/utils/api";
import { router, useRouter } from "expo-router";
import { Button, Form, H4, Input, Label, Spinner } from "tamagui";
import APIS from "@/constants/endpoint";

export default function OlvidoClave() {
  const [email, setEmail] = useState({ value: "", error: "" });
  const router = useRouter();

  const [mostrarAnimacionCargando, setMostrarAnimacionCargando] =
    useState(false);

  const crearCuentaPressed = async () => {
    Keyboard.dismiss();
    setMostrarAnimacionCargando(true);

    try {
      const respuestaApiLogin = await consultarApi<any>(
        APIS.seguridad.cambioClaveSolicitar,
        {
          username: email.value,
        }
      );

      setMostrarAnimacionCargando(false);

      if (respuestaApiLogin.user) {
        //       let informacionUsuario = respuestaApiLogin.usuario;
        //       informacionUsuario = {
        //         ...informacionUsuario,
        //         ...{ tokenFireBase: "" },
        //       };

        //       // let consultaFireBase = await database()
        //       //   .ref(`/session/${informacionUsuario.codigo}`)
        //       //   .once('value');
        //       // const informacionFirebase = await consultaFireBase._snapshot.value;
        //       // if (informacionFirebase) {
        //       //   actualizarRegistroFireBase(informacionUsuario.codigo, {
        //       //     fechaAutenticacion: `${fechaActual().fecha} ${
        //       //       fechaActual().hora
        //       //     }`,
        //       //     token: tokenFirebase,
        //       //   });
        //       // } else {
        //       //   crearRegistroFireBase(
        //       //     informacionUsuario.codigo,
        //       //     tokenFirebase,
        //       //   );
        //       // }
        //       // const db = await getDbConeccion();
        //       // const usuarioObtenido = await obtenerUsuarios(db, usuario);
        //       // if (usuarioObtenido.length === 0) {
        //       //   await guardarUsuarioOffline(db, informacionUsuario);
        //       //   db.close();
        //       //   dispatch(setUsuarioInformacion(informacionUsuario));
        //       // }

        router.replace("/(app)/(login)");
      } else {
        //       // toast.show({
        //       //   title: 'Algo ha salido mal',
        //       //   //status: 'warning',
        //       //   description: 'error al autenticar',
        //       //   placement: 'bottom-right',
        //       // });
      }
    } catch (error: any) {
      setMostrarAnimacionCargando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Form
            gap="$4"
            onSubmit={() => crearCuentaPressed()}
            paddingInline="$4"
          >
            <H4 mt="$8">Recordar contraseña</H4>

            <Label>Correo</Label>
            <Input
              size="$4"
              borderWidth={2}
              onChangeText={(text) => setEmail({ value: text, error: "" })}
            />

            <Form.Trigger asChild disabled={mostrarAnimacionCargando}>
              <Button
                theme="blue"
                icon={mostrarAnimacionCargando ? () => <Spinner /> : undefined}
              >
                Enviar
              </Button>
            </Form.Trigger>
          </Form>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
