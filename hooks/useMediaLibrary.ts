import { useState } from "react";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      // 1. Verificar permisos
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Se requieren permisos para acceder a la galería");
      }
      // 2. Comprobar si la carpeta existe
      const subdominio = await AsyncStorage.getItem("subdominio");
      const rutaCarpeta = FileSystem.documentDirectory + subdominio! + "/";

      const carpetaInfo = await FileSystem.getInfoAsync(rutaCarpeta);
      if (!carpetaInfo.exists) {
        await FileSystem.makeDirectoryAsync(rutaCarpeta, { intermediates: true });
      }

      // 3. Definir el nombre del nuevo archivo
      const nombreArchivo = uri.split("/").pop();
      const nuevaRuta = rutaCarpeta + nombreArchivo;

      // 4. Copiar el archivo
      await FileSystem.copyAsync({
        from: uri,
        to: nuevaRuta,
      });      
      return nuevaRuta; // Devuelve la nueva ruta por si la necesitas
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setGuardando(false);
    }
  }

  return {
    guardarArchivo,
    guardando,
    error,
  };
};