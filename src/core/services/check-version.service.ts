import { lt as semverLt } from "semver";

export function checkVersion(local: string, min: string) {
  if (semverLt(local, min)) {
    return "requiere_actualizacion";
  }
  return "actualizacion_disponible";
}