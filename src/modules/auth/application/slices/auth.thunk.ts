import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginFormType } from "../../domain/types/login.types";
import { LoginUserUseCase } from "../user-cases/login.use-case";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { CrearCuentaFormType } from "../../domain/interfaces/crear-cuenta.interface";
import { CrearCuentaUseCase } from "../user-cases/crear-cuenta.use-case";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginFormType, { rejectWithValue }) => {
    try {
      const response = await new LoginUserUseCase().execute(payload);
      await storageService.setItem(STORAGE_KEYS.jwtToken, response.token);
      await storageService.setItem(STORAGE_KEYS["refresh-token"], response["refresh-token"]);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const crearCuentaThunk = createAsyncThunk(
  'auth/crearCuenta',
  async (payload: CrearCuentaFormType, {rejectWithValue}) => {
    try {
      const response = await new CrearCuentaUseCase().execute(payload)
      return response;
    } catch (error: any) {      
      return rejectWithValue(error);
    }
  }
)