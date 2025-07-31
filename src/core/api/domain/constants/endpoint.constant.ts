const URL_BASE = "https://reddocapi.co";
const URL_SUBDOMINIO = "https://subdominio.reddocapi.co";

const APIS = {
  seguridad: {
    login: `${URL_BASE}/seguridad/login/`,
    refreshToken: `${URL_BASE}/seguridad/token/refresh/`,
    usuario: `${URL_BASE}/seguridad/usuario/`,
    verificar: `${URL_BASE}/seguridad/usuario/verificar/`,
    cambioClaveSolicitar: `${URL_BASE}/seguridad/usuario/cambio-clave-solicitar/`,
    verificacion: `${URL_BASE}/seguridad/verificacion/`,
    cambioClaveVerificar: `${URL_BASE}/seguridad/usuario/cambio-clave-verificar/`,
    cambioClave: `${URL_BASE}/seguridad/usuario/cambio-clave/`,
  },
  entrega: {
    verticalEntrega: `${URL_BASE}/vertical/entrega/`,
    ruteoVisitaEntrega: `${URL_SUBDOMINIO}/ruteo/visita/entrega/`,
  },
  general: {
    funcionalidadLista: `${URL_SUBDOMINIO}/general/funcionalidad/lista/`,
  },
  ruteo: {
    ubicacion: `${URL_SUBDOMINIO}/ruteo/ubicacion/`,
    visitaEntrega: `${URL_SUBDOMINIO}/ruteo/visita/entrega/`,
    novedadTipo: `${URL_SUBDOMINIO}/ruteo/novedad_tipo/`,
    novedad: `${URL_SUBDOMINIO}/ruteo/novedad/`,
    visita: `${URL_SUBDOMINIO}/ruteo/visita/`,
    novedadNuevo: `${URL_SUBDOMINIO}/ruteo/novedad/nuevo/`,
    novedadSolucionar: `${URL_SUBDOMINIO}/ruteo/novedad/solucionar/`,
  },
};

export default APIS;