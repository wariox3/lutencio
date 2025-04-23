import usuarioInformacionReducer from '../reducers/usuarioReducer';
import entregaInformacionReducer from '../reducers/entregaReducer';
import configuracionInformacionReducer from '../reducers/configuracionReducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  usuario: usuarioInformacionReducer,
  entregas: entregaInformacionReducer,
  configuracion: configuracionInformacionReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
