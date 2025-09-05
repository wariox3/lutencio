import { obtenerAuth } from "@/src/application/selectors/usuario.selector";
import { useAppSelector } from "@/src/application/store/hooks";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import VersionCheck from "react-native-version-check";

export default function useAcercaDeViewModel() {
  const router = useRouter();
  const {obtenerColor} = useTemaVisual()
  const auth = useAppSelector(obtenerAuth);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const latestVersion = await VersionCheck.getLatestVersion();
        const currentVersion = await VersionCheck.getCurrentVersion();

        if (latestVersion !== currentVersion) {
          setNeedsUpdate(true);
          const url = await VersionCheck.getStoreUrl(); // URL de la tienda
          setStoreUrl(url);
        }
      } catch (error) {
        console.log("Error comprobando versión:", error);
      }
    };

    checkVersion();
  }, []);


  function navegarTerminos() {
    router.push(rutasApp.terminos);
  }

  function navegarPoliticas() {
    router.push(rutasApp.privacidad);
  }

  function navegarEliminarCuenta() {
    router.push(rutasApp.eliminarCuenta);
  }

  return {
    navegarPoliticas,
    navegarTerminos,
    navegarEliminarCuenta,
    auth,
    obtenerColor,
    needsUpdate,
    storeUrl
  };
}
