export type OlvidoClaveFormType = {
  username: string;
  aplicacion: string;
};

export type OlvidoClaveResponse = {
  verificacion: Verificacion;
};

export interface Verificacion {
  accion: string;
  contenedor_id: null | number;
  estado_usado: boolean;
  id: number;
  token: string;
  usuario_id: number;
  usuario_invitado_username: string | null;
  vence: string;
}
