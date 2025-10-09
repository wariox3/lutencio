import WebView from "react-native-webview";
import { terminoStyles } from "../../stylesheet/terminos.stylesheet";

export default function TerminosScreen() {
  return (
    <WebView
      style={terminoStyles.container}
      source={{ uri: 'http://ruteo.online/terminos_de_uso' }}
    />
  );
}