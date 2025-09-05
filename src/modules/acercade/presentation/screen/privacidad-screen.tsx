import { WebView } from 'react-native-webview';
import React from "react";
import { privacidadStyles } from "../../stylesheet/privacidad.stylesheet";

export default function PrivacyScreen() {
  return (
    <WebView
      style={privacidadStyles.container}
      source={{ uri: 'http://ruteo.online/politicas_privacidad' }}
    />
  );
}