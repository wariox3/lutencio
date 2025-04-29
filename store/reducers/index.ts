import { combineReducers } from "redux";
import configuracionInformacionReducer from "../reducers/configuracionReducer";
import entregaInformacionReducer from "../reducers/entregaReducer";
import usuarioInformacionReducer from "../reducers/usuarioReducer";

const rootReducer = combineReducers({
  usuario: usuarioInformacionReducer,
  entregas: entregaInformacionReducer,
  configuracion: configuracionInformacionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
