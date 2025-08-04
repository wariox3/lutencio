import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";
import rootReducer from "./root-reducer";
import { sincronizacionMiddleware } from "@/src/modules/visita/application/store/sincronizacion.middleware";
import { SincronizacionService } from "@/src/modules/visita/application/services/sincronizacion.service";

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  timeout: 0,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sincronizacionMiddleware)
});

export const persistor = persistStore(store);

// Importar el servicio después de crear la store para evitar la circularidad
// Inyectar la store en el servicio
SincronizacionService.getInstance().setStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
