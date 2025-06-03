// store/alertSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AlertState {
  visible: boolean
  titulo: string
  mensaje: string
}

const initialState: AlertState = {
  visible: false,
  titulo: '',
  mensaje: '',
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    mostrarAlerta: (
      state,
      action: PayloadAction<{
        titulo: string
        mensaje: string
        onAceptar?: () => void
      }>
    ) => {
      state.visible = true
      state.titulo = action.payload.titulo
      state.mensaje = action.payload.mensaje
    },
    ocultarAlerta: (state) => {
      state.visible = false
      state.titulo = ''
      state.mensaje = ''
    },
  },
})

export const { mostrarAlerta, ocultarAlerta } = alertSlice.actions
export default alertSlice.reducer
