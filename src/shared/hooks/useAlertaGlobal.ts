// hooks/useAlertaGlobal.ts
import { useDispatch } from 'react-redux'
import { mostrarAlerta, ocultarAlerta } from '@/src/application/slices/alert.slice'
import { useEffect } from 'react'

const onAceptarRef = { current: null as (() => void) | null }

let instanciaGlobal: ((params: {
  titulo: string
  mensaje: string
  onAceptar?: () => void
}) => void) | null = null

export const mostrarAlertHook = (params: {
  titulo: string
  mensaje: string
  onAceptar?: () => void
}) => {
  if (instanciaGlobal) {
    instanciaGlobal(params)
  } else {
    console.warn('⚠️ Alerta global no está lista')
  }
}


export function useAlertaGlobal() {

  useEffect(() => {
    instanciaGlobal = abrirAlerta
    return () => {
      instanciaGlobal = null
    }
  }, [])
  


  const dispatch = useDispatch()

  const abrirAlerta = ({
    titulo,
    mensaje,
    onAceptar,
  }: {
    titulo: string
    mensaje: string
    onAceptar?: () => void
  }) => {
    onAceptarRef.current = onAceptar ?? null
    dispatch(mostrarAlerta({ titulo, mensaje }))
  }

  const aceptar = () => {
    if (onAceptarRef.current) {
      onAceptarRef.current()
    }
    onAceptarRef.current = null
    dispatch(ocultarAlerta())
  }

  const cancel = () => {
    onAceptarRef.current = null
    dispatch(ocultarAlerta())
  }

  return { abrirAlerta, aceptar, cancel }
}
