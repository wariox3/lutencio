import { Entrega } from "@/interface/entrega/entrega";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConfiguracionState {
    modoPrueba: boolean;
}

const initialState: ConfiguracionState = {
    modoPrueba: false,
};

const configuracionSlice = createSlice({
    name: "configuracion",
    initialState,
    reducers: {
        setModoPrueba(state, action: PayloadAction<boolean>) {
            state.modoPrueba = action.payload;
        },
    }
})

export const {
    setModoPrueba
} = configuracionSlice.actions;
export default configuracionSlice.reducer;
