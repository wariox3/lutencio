import { rutasApp } from "@/src/core/constants/rutas.constant";
import { ChevronRight, FilePlus } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Card, H6, ListItem, Text, YGroup } from "tamagui";

const CardGestionEntrega = () => {
  const router = useRouter();

  const navegarCargar = () => {
    router.navigate(rutasApp.vistaCargar);
  };

  return (
    <>
      <Card
        flex={0.1}
        my={"$2"}
        borderStyle={"dashed"}
        bordered
        padding={16}
        mx={"$2"}
      >
        <H6 mb="$2">Gestión de Entregas </H6>
        <Text mb="$4">
          Administra tus órdenes de entrega de forma rápida y sencilla
        </Text>
        <Card>
          <YGroup width={"auto"} flex={1} size="$4" gap="$4">
            <YGroup.Item>
              <ListItem
                hoverTheme
                theme={"blue"}
                icon={<FilePlus size="$2" />}
                iconAfter={<ChevronRight size="$2" />}
                title="Orden de entrega"
                subTitle="Vincular una orden de entrega"
                onPress={() => navegarCargar()}
                borderBottomEndRadius={"$4"}
                borderBottomStartRadius={"$4"}
                borderStartStartRadius={"$4"}
                borderStartEndRadius={"$4"}
              />
            </YGroup.Item>
          </YGroup>
        </Card>
      </Card>
    </>
  );
};

export default CardGestionEntrega;
