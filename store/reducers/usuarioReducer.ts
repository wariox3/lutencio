import { Usuario } from '@/interface/usuario/usuario';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: Usuario = {
  id: 0,
  username: '',
  imagen: '',
  nombre_corto: '',
  nombre: null,
  apellido: null,
  telefono: null,
  correo: '',
  idioma: null,
  dominio: '',
  fecha_limite_pago: new Date().toISOString(),
  fecha_creacion: new Date().toISOString(),
  vr_saldo: 0,
  verificado: false,
  es_socio: false,
  socio_id: '',
  is_active: false,
  numero_identificacion: '',
  cargo: ''
};

const usuarioSlice = createSlice({
  name: 'usuarioInformacion',
  initialState,
  reducers: {
    setUsuarioInformacion: (state, action: PayloadAction<Usuario>) => {
      return {
        ...state,
        ...action.payload
      };
    },
    actualizarUsuarioInformacion: (
      state,
      action: PayloadAction<Partial<Usuario>>,
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    cerrarSesionUsuario: () => {
      return initialState;
    },
  },
});

export const {
  setUsuarioInformacion,
  actualizarUsuarioInformacion,
  cerrarSesionUsuario,
} = usuarioSlice.actions;

export default usuarioSlice.reducer;
