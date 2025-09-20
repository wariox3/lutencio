import { Platform, Alert, Linking } from "react-native";
import { UrlStore } from "../constants/store-url.const";
import { appInfoService } from "./app-info-service";
import { checkVersion } from "./check-version.service";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import { VerticalApiRepository } from "@/src/modules/visita/infraestructure/api/vertical-api.service";

export async function validarVersionApp(opcional = false) {
  try {
    const version = await new VerticalApiRepository().getVersionRuteo()
    const estado: "requiere_actualizacion" | "actualizacion_disponible" = checkVersion(`${appInfoService.getVersion()}`, Platform.OS === "ios" ? version.version_ruteo_ios : version.version_ruteo_android);
    if (estado === "requiere_actualizacion") {
      mostrarAlertHook({
        mensaje: "Debes actualizar la aplicación para continuar usando el servicio.",
        titulo: "Actualización requerida",
        onAceptar: () => {
          Linking.openURL(
            Platform.OS === "ios" ? UrlStore.apple : UrlStore.google
          )
        },
      })
      return false;
    }

    if (opcional && estado === "actualizacion_disponible") {
      mostrarAlertHook({
        mensaje: "Hay una nueva versión con mejoras. ¿Quieres actualizar ahora?",
        titulo: "Actualización disponible",
        onAceptar: () => {
          Linking.openURL(
            Platform.OS === "ios" ? UrlStore.apple : UrlStore.google
          )
        },
      })
    }
    return true;
  } catch (e) {
    console.log("Error validando versión:", e);
    return true;
  }
}