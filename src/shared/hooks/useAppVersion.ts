import { appInfoService } from "@/src/core/services/app-info-service";
import { useMemo } from "react";

export function useAppVersion() {
  const version = useMemo(() => appInfoService.getVersion(), []);
  const build = useMemo(() => appInfoService.getBuildNumber(), []);

  return { version, build };
}