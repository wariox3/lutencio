import { useState } from "react";
import * as MediaLibrary from "expo-media-library";
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
