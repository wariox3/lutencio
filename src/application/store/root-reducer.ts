import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/src/modules/auth/application/slices/auth.slice";

const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
