import React, { memo } from "react";
import { XCircle } from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import Animated, { FadeIn, SlideInUp } from "react-native-reanimated";
import { Button, H4, XStack, YStack, View } from "tamagui";
import { StyleSheet } from "react-native";
import { ModalAlertProps } from "../../interface/comun";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";

const ModalAlert: React.FC<ModalAlertProps> = ({
  children,
  showBackButton = true,
  titulo = "Opciones",
}) => {
  const { obtenerColor } = useTemaVisual();

  return (
    <Animated.View entering={FadeIn} style={styles.overlay}>
      <Animated.View entering={SlideInUp} style={styles.container}>
        <View
          flex={1}
          p="$4"
          bg={obtenerColor("BLANCO", "NEGRO")} 
        >
          {/* Header */}
          <XStack justify="space-between" items="center" mb="$4">
            <H4>{titulo}</H4>

            <Link href="../" asChild>
              <Button
                size="$4"
                circular
                accessibilityLargeContentTitle="Cerrar"
                icon={<XCircle size="$3" color={"$red10"} />}
                theme="red"
              />
            </Link>
          </XStack>

          {/* Contenido dinámico */}
          <YStack flex={1}>{children}</YStack>

          {/* Espaciador opcional */}
          {showBackButton && <YStack mt="$4" />}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default memo(ModalAlert);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000040",
  },
  container: {
    width: "90%",
    height: "95%",
  },
});
