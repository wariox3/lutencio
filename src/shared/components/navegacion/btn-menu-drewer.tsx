import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Menu } from "@tamagui/lucide-icons";
import { Button } from "tamagui";
import { useTemaVisual } from "../../hooks/useTemaVisual";

const BtnMenuDrawer = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const {obtenerColor} = useTemaVisual()

  const handleOpenMenuDrawer = () => {
    navigation.toggleDrawer(); // Esto debería funcionar si la navegación está bien configurada
  };

  return (
    <Button onPressIn={handleOpenMenuDrawer} style={{ padding: 10, backgroundColor: "transparent", borderColor: "transparent" }}>
      <Menu color={obtenerColor("NEGRO","BLANCO")} size={24} />
    </Button>
  );
};

export default BtnMenuDrawer;
