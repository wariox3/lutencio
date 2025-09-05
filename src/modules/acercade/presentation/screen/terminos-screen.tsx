import React from "react";
import { terminoStyles } from "../../stylesheet/terminos.stylesheet";
import { ScrollView, Text, View } from "tamagui";
import WebView from "react-native-webview";

export default function TerminosScreen() {
  return (
    <WebView
      style={terminoStyles.container}
      source={{ uri: 'http://ruteo.online/terminos_de_uso' }}
    />
  );
}