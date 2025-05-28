import { useEffect, useRef } from 'react';

export const useIntervalActivo = (
  condicion: boolean,
  callback: () => void,
  intervalo: number = 30000
) => {
  const intervaloRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Actualizar la referencia del callback cuando cambia
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const ejecutarCallback = () => {
      try {
        callbackRef.current();
      } catch (error) {
        console.error('Error en el callback del intervalo:', error);
      }
    };

    if (condicion) {
      // Ejecutar inmediatamente al activar
      ejecutarCallback();

      // Configurar el intervalo
      intervaloRef.current = setInterval(ejecutarCallback, intervalo);

      // Limpieza al desmontar o cuando la condición cambie
      return () => {
        if (intervaloRef.current) {
          clearInterval(intervaloRef.current);
          intervaloRef.current = null;
        }
      };
    } else {
      // Limpiar el intervalo si la condición es falsa
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
    }
  }, [condicion, intervalo]);
};