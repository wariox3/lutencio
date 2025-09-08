import { CircleAlert, Home, User } from "@tamagui/lucide-icons";
import { rutasApp } from "./rutas.constant";

export type MenuItem = {
  icon: any; // cada icono importado es un componente tipo LucideIcon
  ruta: string;
  etiqueta: string;
};

export type MenuItems = Record<string, MenuItem>;

export const menuItems: MenuItems = {
  Inicio: { icon: Home, ruta: rutasApp.home, etiqueta: "Inicio" },
  Perfil: { icon: User, ruta: rutasApp.perfil, etiqueta: "Perfil" },
  AcercaDe: {
    icon: CircleAlert,
    ruta: rutasApp.acercaDe,
    etiqueta: "Acerca de ruteo.co",
  },
};
