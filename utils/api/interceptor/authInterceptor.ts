import AsyncStorage from "@react-native-async-storage/async-storage";
import { InternalAxiosRequestConfig } from "axios";

export const authInterceptor = async (
  axiosPeticion: InternalAxiosRequestConfig
) => {
  const requiereToken = axiosPeticion?.headers?.requiereToken ?? true;
  if (requiereToken) {
    const jwtToken = await AsyncStorage.getItem("jwtToken");
    if (jwtToken) {
      axiosPeticion.headers.Authorization = `Bearer ${jwtToken}`;
    }
  }
  return axiosPeticion;
};
