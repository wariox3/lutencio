export const rutasApp = {
  login: "/(app)/(login)",
  crearCuenta: "/(app)/(login)/crearCuenta",
  olvidoClave: '/(app)/(login)/olvidoClave',
  home: "/(app)/(tabs)/inicio",
  visitas: "/(app)/(visitas)/lista",


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
