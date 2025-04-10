import { Home, StickyNote } from "@tamagui/lucide-icons";
import { rutasApp } from "./rutas";

export const menuItems: Record<string, { icon: any; ruta: string }> = {
    Inicio: { icon: Home, ruta: rutasApp.home },
    Visitas: { icon: StickyNote, ruta: rutasApp.entrega },
  };