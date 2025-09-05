import { CircleAlert, Home, User } from "@tamagui/lucide-icons";
import { rutasApp } from "./rutas.constant";

export const menuItems: Record<string, { icon: any; ruta: string }> = {
    Inicio: { icon: Home, ruta: rutasApp.home },
    Perfil: { icon: User, ruta: rutasApp.perfil },
    AcercaDe: { icon: CircleAlert, ruta: rutasApp.acercaDe },
};