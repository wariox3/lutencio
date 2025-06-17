import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Menu } from "@tamagui/lucide-icons";
import React from "react";
import { Pressable } from "react-native";
import { useTemaVisual } from "../../hooks/useTemaVisual";

const BtnMenuDrawer = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const {obtenerColor} = useTemaVisual()

  const handleOpenMenuDrawer = () => {
    navigation.toggleDrawer(); // Esto debería funcionar si la navegación está bien configurada
  };

  return (
    <Pressable onPress={handleOpenMenuDrawer} style={{ padding: 10 }}>
      <Menu color={obtenerColor("NEGRO","BLANCO")} size={24} />
    </Pressable>
  );
};

export default BtnMenuDrawer;
