import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/src/modules/auth/application/slices/auth.slice";
import entregaReducer from "@/src/modules/visita/application/slice/entrega.slice";
import configuracionReducer from "@/src/application/slices/configuracion.slice";
import alertaGlobalReducer from "@/src/application/slices/alert.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  entregas: entregaReducer,
  configuracion: configuracionReducer,
  alertaGlobal: alertaGlobalReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
