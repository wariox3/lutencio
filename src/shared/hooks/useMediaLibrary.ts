import { useState } from "react";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storageService from "@/src/core/services/storage.service";
import { STORAGE_KEYS } from "@/src/core/constants";
import { Alert } from "react-native";

export const useMediaLibrary = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFileFromGallery = async (fileUri: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      // 1. Verificar permisos
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Se requieren permisos para acceder a la galería");
      }

      // 2. Obtener el álbum DCIM
      const album = await MediaLibrary.getAlbumAsync("DCIM");
      if (!album) {
        throw new Error("No se encontró el álbum DCIM");
      }

      // 3. Buscar el archivo específico
      const filename = fileUri.split("/").pop();
      const { assets } = await MediaLibrary.getAssetsAsync({
        album: album,
        mediaType: "photo",
        first: 100,
      });

      const targetAsset = assets.find((a) => a.filename === filename);

      if (!targetAsset) {
        throw new Error("El archivo no se encontró en la galería");
      }

      // 4. Eliminar el archivo
      await MediaLibrary.deleteAssetsAsync([targetAsset]);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteFileFromGallery, isDeleting, error };
};

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
      // 1. Comprobar si la carpeta existe
      const subdominio = (await storageService.getItem(STORAGE_KEYS.subdominio)) as string;
      if (!subdominio) {
        Alert.alert("Error de configuración", "No se encontró el subdominio en el almacenamiento.");
        throw new Error("No se encontró el subdominio en el almacenamiento");
      }

      const rutaCarpeta = FileSystem.documentDirectory + subdominio + "/";
      const carpetaInfo = await FileSystem.getInfoAsync(rutaCarpeta);

      if (!carpetaInfo.exists) {
        try {
          await FileSystem.makeDirectoryAsync(rutaCarpeta, { intermediates: true });
        } catch (e) {
          Alert.alert("Error al crear carpeta", "No fue posible crear la carpeta de destino.");
          throw e;
        }
      }

      // 2. Definir el nombre del nuevo archivo
      const nombreArchivo = uri.split("/").pop();
      if (!nombreArchivo) {
        Alert.alert("Error en archivo", "No se pudo obtener el nombre del archivo.");
        throw new Error("No se pudo obtener el nombre del archivo");
      }

      const nuevaRuta = rutaCarpeta + nombreArchivo;

      // 3. Copiar el archivo
      try {
        await FileSystem.copyAsync({ from: uri, to: nuevaRuta });
      } catch (e) {
        Alert.alert("Error de copia", "No se pudo copiar el archivo en la ruta destino.");
        throw e;
      }

      return nuevaRuta; // Devuelve la nueva ruta por si la necesitas
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
}
export const useProcesarImagenes = async (imagenes: Array<{ uri: string }>) => {
  const imagenesProcesadas: any[] = [];
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
