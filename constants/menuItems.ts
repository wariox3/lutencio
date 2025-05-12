import { Home, User } from "@tamagui/lucide-icons";
import { rutasApp } from "./rutas";

export const menuItems: Record<string, { icon: any; ruta: string }> = {
    Inicio: { icon: Home, ruta: rutasApp.home },
    Perfil: { icon: User, ruta: rutasApp.perfil },
};