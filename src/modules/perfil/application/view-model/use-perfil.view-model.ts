import { rutasApp } from "@/constants/rutas";
import { obtenerAuth } from "@/src/application/selectors/usuario.selector";
import { useAppSelector } from "@/src/application/store/hooks";
import { useNavigation, useRouter } from "expo-router";

export default function usePerfilViewModel() {
  const router = useRouter();

  const auth = useAppSelector(obtenerAuth);

  function navegarTerminos() {
    router.push(rutasApp.terminos);
  }

  function navegarPoliticas() {
    router.push(rutasApp.privacidad);
  }

  return {
    navegarPoliticas,
    navegarTerminos,
    auth
  };
}
