import { Entrega } from "@/src/modules/visita/domain/interfaces/vista.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { configuracionThunk } from "./configuracion.thunk";

interface ConfiguracionState {
  modoPrueba: boolean;
  selectores: any;
}

const initialState: ConfiguracionState = {
  modoPrueba: false,
  selectores: {
    novedadTipo: [],
  },
};

const configuracionSlice = createSlice({
  name: "configuracion",
  initialState,
  reducers: {
    setModoPrueba(state, action: PayloadAction<boolean>) {
      state.modoPrueba = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(configuracionThunk.fulfilled, (state, { payload }) => {      
      state.selectores = { ...state.selectores, novedadTipo: payload.results };
    });
  },
});

export const { setModoPrueba } = configuracionSlice.actions;
export default configuracionSlice.reducer;
