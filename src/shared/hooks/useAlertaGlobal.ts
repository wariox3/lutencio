// hooks/useAlertaGlobal.ts
import { useDispatch } from "react-redux";
import {
  mostrarAlerta,
  ocultarAlerta,
} from "@/src/application/slices/alert.slice";
import { useEffect } from "react";

const onAceptarRef = { current: null as (() => void) | null };

let instanciaGlobal: (params: {
  titulo: string;
  mensaje: string;
  onAceptar?: () => void;
}) => void;

export const mostrarAlertHook = (params: {
  titulo: string;
  mensaje: string;
  onAceptar?: () => void;
}) => {
  instanciaGlobal(params);
};

export function useAlertaGlobal() {
  useEffect(() => {
    instanciaGlobal = abrirAlerta;
  }, []);

  const dispatch = useDispatch();

  const abrirAlerta = ({
    titulo,
    mensaje,
    onAceptar,
  }: {
    titulo: string;
    mensaje: string;
    onAceptar?: () => void;
  }) => {
    onAceptarRef.current = onAceptar ?? null;
    dispatch(mostrarAlerta({ titulo, mensaje }));
  };

  const aceptar = () => {
    if (onAceptarRef.current) {
      onAceptarRef.current();
    }
    onAceptarRef.current = null;
    dispatch(ocultarAlerta());
  };

  const cancel = () => {
    onAceptarRef.current = null;
    dispatch(ocultarAlerta());
  };

  return { abrirAlerta, aceptar, cancel };
}
