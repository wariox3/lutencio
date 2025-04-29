import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginFormType } from "../../domain/types/login.types";
import { LoginUserUseCase } from "../user-cases/login.user-case";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";

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
