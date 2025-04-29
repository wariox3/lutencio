import { ApiConfig } from "../domain/interfaces/api.interface";
import ApiService from "./api.service";

// Configuración inicial (puede venir de variables de entorno)
const apiConfig: ApiConfig = {
  baseUrl: process.env.API_BASE_URL || "https://api.example.com/v1",
  headers: {
    // Headers comunes
  },
  timeout: 30000,
};

// Creamos una instancia única del servicio
const apiService = new ApiService(apiConfig);

// Exportamos la instancia y la clase por si se necesita crear múltiples instancias
export { ApiService, apiService as default };
