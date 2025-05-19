import { WebView } from "react-native-webview";
import React from "react";
import { privacidadStyles } from "../../stylesheet/privacidad.stylesheet";
import { H3 } from "tamagui";

export default function EliminarCuentaScreen() {
  return (
    <>
      <H3>Registre tu solicitud </H3>
      <WebView
        style={privacidadStyles.container}
        source={{ uri: "https://semantica.com.co/soporte/nuevo/SOL" }}
      />
    </>
  );
}
