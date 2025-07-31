import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/src/modules/auth/application/slices/auth.slice";
import entregaReducer from "@/src/modules/visita/application/slice/entrega.slice";
import configuracionReducer from "@/src/application/slices/configuracion.slice";
import alertaGlobalReducer from "@/src/application/slices/alert.slice";
import novedadReducer from "@/src/modules/novedad/application/store/novedad.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  novedades: novedadReducer,
  entregas: entregaReducer,
  configuracion: configuracionReducer,
  alertaGlobal: alertaGlobalReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
