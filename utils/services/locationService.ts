import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as BackgroundFetch from 'expo-background-fetch';
import { registerTaskAsync } from 'expo-background-fetch';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { consultarApi } from "../api";
import APIS from "@/constants/endpoint";

export const TAREA_SEGUIMIENTO_UBICACION = "tarea-seguimiento-ubicacion";

// 1. Definir la tarea (esto debe ejecutarse al inicio de la app)
TaskManager.defineTask(TAREA_SEGUIMIENTO_UBICACION, async ({ data, error }) => {
  if (error) {
    console.error("Error en la tarea:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
  
  try {
    if (data && data.locations && data.locations.length > 0) {
      await enviarUbicacion(data.locations[0]);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }
    
    // Si no hay ubicación, intentamos obtener una manualmente
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    await enviarUbicacion(location);
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Error procesando ubicación:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const enviarUbicacion = async (location: Location.LocationObject) => {
  try {
    const subdominio = await AsyncStorage.getItem("subdominio");
    const usuario_id = await AsyncStorage.getItem("usuario_id");
    const despacho = await AsyncStorage.getItem("despacho");
    
    if (!subdominio || !usuario_id || !despacho) {
      console.warn("Faltan datos necesarios para enviar la ubicación");
      return;
    }

    await consultarApi<any>(
      APIS.ruteo.ubicacion,
      {
        usuario_id,
        despacho,
        latitud: location.coords.latitude,
        longitud: location.coords.longitude,
      },
      {
        requiereToken: true,
        subdominio,
      }
    );
  } catch (error) {
    console.error("Error enviando ubicación:", error);
    // Podrías implementar un sistema de reintentos aquí
  }
};

export async function iniciarTareaSeguimientoUbicacion() {
  try {
    // 1. Solicitar permisos
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permisos de ubicación en primer plano no concedidos");
      return false;
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== "granted") {
      console.warn("Permisos de ubicación en segundo plano no concedidos");
      return false;
    }

    // 2. Configurar opciones para Android e iOS
    const options: Location.LocationTaskOptions = {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 30000, // 30 segundos
      distanceInterval: 0, // Reportar siempre, sin importar distancia
      deferredUpdatesInterval: 30000, // iOS
      deferredUpdatesDistance: 0, // iOS
      showsBackgroundLocationIndicator: true, // Mostrar indicador en Android
      foregroundService: {
        notificationTitle: 'Rastreo de ubicación activo',
        notificationBody: 'El servicio está obteniendo tu ubicación en segundo plano',
        notificationColor: '#ff0000',
      },
      // iOS específico
      activityType: Location.LocationActivityType.Fitness,
      pausesUpdatesAutomatically: false, // No pausar cuando el dispositivo no se mueve
    };

    // 3. Iniciar actualizaciones de ubicación
    await Location.startLocationUpdatesAsync(
      TAREA_SEGUIMIENTO_UBICACION,
      options
    );

    // 4. Registrar tarea de background fetch para Android
    await BackgroundFetch.registerTaskAsync(TAREA_SEGUIMIENTO_UBICACION, {
      minimumInterval: 30, // segundos
      stopOnTerminate: false, // Continuar cuando la app se cierre
      startOnBoot: true, // Iniciar al arrancar el dispositivo
    });

    console.log("Servicio de ubicación en segundo plano iniciado correctamente");
    return true;
  } catch (error: any) {
    console.error("Error al iniciar el servicio:", error);
    return false;
  }
}

export async function detenerTareaSeguimientoUbicacion() {
  try {
    // 1. Verificar si la tarea está registrada
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      TAREA_SEGUIMIENTO_UBICACION
    );
    
    if (isRegistered) {
      // 2. Detener las actualizaciones de ubicación
      await Location.stopLocationUpdatesAsync(TAREA_SEGUIMIENTO_UBICACION);
      
      // 3. Cancelar el background fetch (Android)
      await BackgroundFetch.unregisterTaskAsync(TAREA_SEGUIMIENTO_UBICACION);
      
      console.log("Servicio de ubicación detenido correctamente");
    }
    return true;
  } catch (error: any) {
    console.error("Error al detener el servicio:", error);
    return false;
  }
}

export async function comprobarRegistroTareaGeolocalizacion() {
  return await TaskManager.isTaskRegisteredAsync(TAREA_SEGUIMIENTO_UBICACION);
}

// Función adicional para verificar si el servicio está activo
export async function verificarEstadoServicioUbicacion() {
  try {
    const [isTaskRegistered, hasStartedLocationUpdates] = await Promise.all([
      TaskManager.isTaskRegisteredAsync(TAREA_SEGUIMIENTO_UBICACION),
      Location.hasStartedLocationUpdatesAsync(TAREA_SEGUIMIENTO_UBICACION),
    ]);
    
    return {
      isTaskRegistered,
      hasStartedLocationUpdates,
      isActive: isTaskRegistered && hasStartedLocationUpdates,
    };
  } catch (error) {
    console.error("Error verificando estado del servicio:", error);
    return {
      isTaskRegistered: false,
      hasStartedLocationUpdates: false,
      isActive: false,
    };
  }
}