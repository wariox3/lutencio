import * as Application from "expo-application";

export const appInfoService = {
  getVersion: () => Application.nativeApplicationVersion ?? "0.0.0",
  getBuildNumber: () => Application.nativeBuildVersion ?? "0",
};