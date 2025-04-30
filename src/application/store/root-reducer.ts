import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/src/modules/auth/application/slices/auth.slice";
import entregaReducer from "@/src/modules/entrega/application/slices/entrega.slice";
import configuracionReducer from "@/src/application/slices/configuracion.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  entregas: entregaReducer,
  configuracion: configuracionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
