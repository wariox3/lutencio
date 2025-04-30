export const rutasApp = {
  login: "/(app)/(login)",
  crearCuenta: "/(app)/(login)/crearCuenta",
  olvidoClave: '/(app)/(login)/olvidoClave',
  home: "/(app)/(maindreawer)/(tabs)/(inicio)",
  entrega: "/entrega",
  entregaCargar: "/(app)/(maindreawer)/entregaCargar",
  entregaFormulario: "/(app)/(maindreawer)/entregaFormulario",
  entregaNovedad: "/(app)/(maindreawer)/entregaNovedad",
  entregaPendientes: "/(app)/(maindreawer)/entregaPendientes",
  entregaMapa: "/(app)/(maindreawer)/entregaMapa",
  entregaPendientesDetalle:
    "/(app)/(maindreawer)/entregaPendientesDetalle/[entregaId]",
} as const;
