import usuarioInformacionReducer from '../reducers/usuarioReducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  usuario: usuarioInformacionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
