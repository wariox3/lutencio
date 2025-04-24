
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { consultarApi } from "../api";
import APIS from "@/constants/endpoint";

export const TAREA_SEGUIMIENTO_UBICACION = "tarea-seguimiento-ubicacion";

// 1. Definir la tarea (esto debe ejecutarse al inicio de la app)
TaskManager.defineTask(TAREA_SEGUIMIENTO_UBICACION, ({ data, error }) => {
  if (error) {
    console.error("Error en la tarea:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    enviarUbicacion(locations[0]);
  }
});

const enviarUbicacion = async (locations: any) => {
  const subdominio = await AsyncStorage.getItem("subdominio");
  const usuario_id = await AsyncStorage.getItem("usuario_id");
  const despacho = await AsyncStorage.getItem("despacho");
  const respuestaApiUbicacion = await consultarApi<any>(
    APIS.ruteo.ubicacion,
    {
      usuario_id,
      despacho: despacho!,
      latitud: locations.coords.latitude,
      longitud: locations.coords.longitude,
    },
    {
      requiereToken: true,
      subdominio: subdominio!,
    }
  );
};

export async function iniciarTareaSeguimientoUbicacion() {
  try {
    // 2. Solicitar permisos
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Se requieren permisos de ubicación para continuar.");
      return;
    }

    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== "granted") {
      alert(
        "Activa 'Permitir siempre' en ajustes para el rastreo en segundo plano."
      );
      return;
    }

    // 3. Iniciar la tarea
    const options = {
      accuracy: Location.Accuracy.Balanced, //android
      timeInterval: 30000, // 30 segundos
      distanceInterval: 0, // Reportar siempre, sin importar distancia
      deferredUpdatesInterval: 30000, // iOS
      deferredUpdatesDistance: 0, // iOS
      showsBackgroundLocationIndicator: true, // Mostrar indicador en Android
      activityType: Location.LocationActivityType.Fitness,
      pausesUpdatesAutomatically: false, // No pausar cuando el dispositivo no se mueve
      foregroundService: {
        notificationTitle: "Rastreo activo",
        notificationBody: "Tu ubicación se está registrando.",
      },
    };

    const result = await Location.startLocationUpdatesAsync(
      TAREA_SEGUIMIENTO_UBICACION,
      options
    );

    // 4. Verificar si la tarea está registrada
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      TAREA_SEGUIMIENTO_UBICACION
    );
  } catch (error: any) {
    //console.error("Error crítico:", error);
    alert("Error al iniciar el servicio: " + error.message);
  }
}

export async function detenerTareaSeguimientoUbicacion() {
  try {
    // 1. Verificar si la tarea está registrada
    const tareaRegistrada = await TaskManager.isTaskRegisteredAsync(
      TAREA_SEGUIMIENTO_UBICACION
    );    
    if (tareaRegistrada) {
      // 2. Detener las actualizaciones de ubicación
      await Location.stopLocationUpdatesAsync(TAREA_SEGUIMIENTO_UBICACION);
      await TaskManager.unregisterTaskAsync(TAREA_SEGUIMIENTO_UBICACION)
    }
    return true;
  } catch (error: any) {
    //console.error("Error al detener el servicio:", error);
    //alert("Error al detener el servicio: " + error.message);
    return false;
  }
}

export async function registrarTareaSeguimientoUbicacion() {
  const tareaRegistrada = await TaskManager.isTaskRegisteredAsync(
    TAREA_SEGUIMIENTO_UBICACION
  );
  return tareaRegistrada;
}

export async function comprobarRegistroTareaGeolocalizacion() {
  return await TaskManager.isTaskRegisteredAsync(TAREA_SEGUIMIENTO_UBICACION);
}
