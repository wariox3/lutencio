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


  //TODO: ELIMINAR ESTAS RUTAS Y CAMBIAR DONDE SE USEN
  entrega: "/entrega",
  entregaCargar: "/(app)/(maindreawer)/entregaCargar",
  entregaFormulario: "/(app)/(maindreawer)/entregaFormulario",
  entregaNovedad: "/(app)/(maindreawer)/entregaNovedad",
  entregaPendientes: "/(app)/(maindreawer)/entregaPendientes",
  entregaMapa: "/(app)/(maindreawer)/entregaMapa",
  entregaPendientesDetalle:
    "/(app)/(maindreawer)/entregaPendientesDetalle/[entregaId]",
} as const;
