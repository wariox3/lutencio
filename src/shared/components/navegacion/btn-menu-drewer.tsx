import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Menu } from "@tamagui/lucide-icons";
import React from "react";
import { Pressable } from "react-native";
import { useTemaVisual } from "../../hooks/useTemaVisual";
import { Button } from "tamagui";

const BtnMenuDrawer = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const {obtenerColor} = useTemaVisual()

  const handleOpenMenuDrawer = () => {
    navigation.toggleDrawer(); // Esto debería funcionar si la navegación está bien configurada
  };

  return (
    <Button onPress={handleOpenMenuDrawer} style={{ padding: 10, backgroundColor: "transparent", borderColor: "transparent" }}>
      <Menu color={obtenerColor("NEGRO","BLANCO")} size={24} />
    </Button>
  );
};

export default BtnMenuDrawer;
