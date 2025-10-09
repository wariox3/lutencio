import { AppState, AppStateStatus } from "react-native";
import { Camera } from "expo-camera";
import { useEffect, useState, useRef } from "react";

export function usePermiso() {
  const [permiso, setPermiso] = useState<"granted" | "denied" | "undetermined">("undetermined");
  const appState = useRef(AppState.currentState);

  const verificarPermiso = async () => {
    const { status } = await Camera.getCameraPermissionsAsync(); // ✅ solo consulta
    setPermiso(status);
  };

  useEffect(() => {
    verificarPermiso(); // Verifica al montar

    const subscription = AppState.addEventListener("change", async (nextAppState: AppStateStatus) => {        
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        await verificarPermiso(); // Revisa el permiso al volver a la app
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  return permiso;
}
