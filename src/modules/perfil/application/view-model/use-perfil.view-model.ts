import { obtenerAuth } from "@/src/application/selectors/usuario.selector";
import { useAppSelector } from "@/src/application/store/hooks";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { useRouter } from "expo-router";

export default function usePerfilViewModel() {
  const router = useRouter();
  const {obtenerColor} = useTemaVisual()
  const auth = useAppSelector(obtenerAuth);

  function navegarTerminos() {
    router.push(rutasApp.terminos);
  }

  function navegarPoliticas() {
    router.push(rutasApp.privacidad);
  }

  function navegarEliminarCuenta() {
    router.push(rutasApp.eliminarCuenta);
  }

  return {
    navegarPoliticas,
    navegarTerminos,
    navegarEliminarCuenta,
    auth,
    obtenerColor
  };
}
