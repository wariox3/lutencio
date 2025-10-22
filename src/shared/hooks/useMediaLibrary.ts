import { useState } from "react";
import * as FileSystem from "expo-file-system";
import storageService from "@/src/core/services/storage.service";
import { STORAGE_KEYS } from "@/src/core/constants";
import { Alert } from "react-native";

export const useEliminarEnGaleria = () => {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarArchivo = async (uri: string) => {
    setEliminando(true);
    setError(null);

    try {
      // 1. Comprobar si el archivo existe
      const archivoInfo = await FileSystem.getInfoAsync(uri);
      if (!archivoInfo.exists) {
        throw new Error("El archivo no existe");
      }

      // 2. Eliminar el archivo
      await FileSystem.deleteAsync(uri);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setEliminando(false);
    }
  };

  return {
    eliminarArchivo,
    eliminando,
    error,
  };
};

export const useGuardarEnGaleria = () => {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Aquí añadirías tu función para guardar un archivo en la galería
  const guardarArchivo = async (uri: string) => {
    setGuardando(true);
    setError(null);

    try {
      //  Obtener subdominio para crear carpeta
      const subdominio = (await storageService.getItem(STORAGE_KEYS.subdominio)) as string;
      if (!subdominio) {
        Alert.alert("Error de configuración", "No se encontró el subdominio en el almacenamiento.");
        throw new Error("No se encontró el subdominio en el almacenamiento");
      }

      const rutaCarpeta = FileSystem.documentDirectory + subdominio + "/";
      const carpetaInfo = await FileSystem.getInfoAsync(rutaCarpeta);

      if (!carpetaInfo.exists) {
        await FileSystem.makeDirectoryAsync(rutaCarpeta, { intermediates: true });
      }

      // Definir nombre y nueva ruta
      const nombreArchivo = uri.split("/").pop();
      if (!nombreArchivo) throw new Error("No se pudo obtener el nombre del archivo");

      const nuevaRuta = rutaCarpeta + nombreArchivo;

      // Copiar archivo desde caché → carpeta persistente
      await FileSystem.copyAsync({ from: uri, to: nuevaRuta });

      // Eliminar archivo temporal
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
        if (__DEV__) console.log("🧹 Archivo temporal eliminado:", uri);
      } catch (e) {
        if (__DEV__) console.warn("⚠️ No se pudo eliminar el archivo temporal:", e);
      }

      return nuevaRuta;
    } catch (error: any) {
      setError(error.message);
      Alert.alert("Error general", error.message || "Ha ocurrido un error inesperado.");
      return false;
    } finally {
      setGuardando(false);
    }
  };

  return {
    guardarArchivo,
    guardando,
    error,
  };
};

export const useProcesarImagenes = async (imagenes: Array<{ uri: string }>) => {
  const imagenesProcesadas: any = [];
  for (const imagen of imagenes) {
    const fileInfo = await FileSystem.getInfoAsync(imagen.uri);
    if (!fileInfo.exists) {
      console.warn(`⚠️ Imagen no encontrada: ${imagen.uri}`);
      continue;
    }
    const base64 = await FileSystem.readAsStringAsync(imagen.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    imagenesProcesadas.push({ base64: `data:image/jpeg;base64,${base64}` });
  }
  return imagenesProcesadas;
}
