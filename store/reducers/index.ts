import usuarioInformacionReducer from '../reducers/usuarioReducer';
import entregaInformacionReducer from '../reducers/entregaReducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  usuario: usuarioInformacionReducer,
  entregas: entregaInformacionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
