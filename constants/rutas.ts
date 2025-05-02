export const rutasApp = {
  login: "/(auth)/login",
  crearCuenta: "/(auth)/crearCuenta",
  olvidoClave: '/(auth)/olvidoClave',
  home: "/(app)/(tabs)/inicio",
  visitas: "/(app)/(visitas)/lista",
  vistaCargar: "/(app)/(visitas)/cargar",
  vistaPendiente: "/(app)/(visitas)/pendiente",
  visitaEntregar: "/(app)/(visitas)/entregar",
  visitaNovedad: "/(app)/(visitas)/novedad",
} as const;
