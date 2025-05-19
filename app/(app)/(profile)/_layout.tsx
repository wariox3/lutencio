import COLORES from "@/src/core/constants/colores";
import { Stack } from "expo-router";
import React from "react";
import BtnMenuDrewer from "@/src/shared/components/btn-menu-drewer";

export default function ProfileLayout() {
  return (
    <Stack
    screenOptions={{
      headerShadowVisible: false,
      title: "",
      headerStyle: {
        backgroundColor: COLORES.HEADER_BACKGROUND_COLOR
      },
    }}
  >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => <BtnMenuDrewer />
        }}
      />
      <Stack.Screen
        name="terminos"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="privacidad"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="eliminar-cuenta"
        options={{
          headerShown: true,
        }}
      />
    </Stack>
  );
}
