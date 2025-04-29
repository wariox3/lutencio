import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../../domain/types/auth.type";
import { loginThunk } from "./auth.thunk";

const initialState: AuthState = { auth: null, loading: false, error: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (s) => {
      s.auth = null;
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

export const { logout } = authSlice.actions;
export default authSlice.reducer;
