import { ArrowLeft } from "@tamagui/lucide-icons";
import { useNavigation } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

interface VolverProps {
    ruta: string; // Propiedad opcional para definir una ruta específica
  }

export default function Volver({ ruta }: VolverProps) {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.navigate(ruta as never)}>
        <ArrowLeft size="$2" mx={"$3"}></ArrowLeft>
    </Pressable>
  );
}
