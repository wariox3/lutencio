import { Home, StickyNote } from "@tamagui/lucide-icons";
import { rutasApp } from "./rutas";

export const menuItems: Record<string, { icon: any; ruta: string }> = {
    Home: { icon: Home, ruta: rutasApp.home },
    Entrega: { icon: StickyNote, ruta: rutasApp.entrega },
  };