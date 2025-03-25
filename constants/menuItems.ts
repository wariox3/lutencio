import { Home, StickyNote } from "@tamagui/lucide-icons";
import { rutasApp } from "./rutas";

export const menuItems: Record<string, { icon: any; ruta: string }> = {
    home: { icon: Home, ruta: rutasApp.home },
    entrega: { icon: StickyNote, ruta: rutasApp.entrega },
  };