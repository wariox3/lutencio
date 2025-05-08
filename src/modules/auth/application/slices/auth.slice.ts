import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../domain/types/auth.type";
import { loginThunk } from "./auth.thunk";
import { Usuario } from "@/src/modules/user/domain/interfaces/user.interface";

const initialState: AuthState = { auth: null, loading: false, error: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    cerrarSesion: () => {
      return initialState;
    },
    actualizarDatosUsuario: (
      state,
      action: PayloadAction<Partial<Usuario>>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.auth = payload;
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as any;
      }),
});

export const { cerrarSesion, actualizarDatosUsuario } = authSlice.actions;
export default authSlice.reducer;
