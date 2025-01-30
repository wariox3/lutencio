const URL_BASE = "http://reddocapi.online";

const APIS = {
  seguridad: {
    login: `${URL_BASE}/seguridad/login/`,
    usuario: `${URL_BASE}/seguridad/usuario/`,
    verificar: `${URL_BASE}/seguridad/usuario/verificar/`,
    cambioClaveSolicitar: `${URL_BASE}/seguridad/usuario/cambio-clave-solicitar/`,
    verificacion: `${URL_BASE}/seguridad/verificacion/`,
    cambioClaveVerificar: `${URL_BASE}/seguridad/usuario/cambio-clave-verificar/`,
    cambioClave: `${URL_BASE}/seguridad/usuario/cambio-clave/`,
  },
};

export default APIS;
