import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LoginFormType } from "../../domain/types/login.types";
import { LoginUserUseCase } from "../user-cases/login.user-case";
import { LoginResponse } from "../../domain/interfaces/login.interface";
import storageService from "@/src/core/services/storage.service";
import { STORAGE_KEYS } from "@/src/core/constants";

interface AuthState {
  auth: LoginResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = { auth: null, loading: false, error: null };
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginFormType, { rejectWithValue }) => {
    try {
      const response = await new LoginUserUseCase().execute(payload);
      await storageService.setItem(STORAGE_KEYS.jwtToken, response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data);
    }
  }
);

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
        state.error = payload as string;
      }),
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
