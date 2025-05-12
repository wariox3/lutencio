import { XCircle } from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { Button, H4, XStack } from "tamagui";

interface ModalAlertProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  titulo?: string;
}

export default function ModalAlert({
  children,
  showBackButton = true,
  titulo = "Opciones", // Valor por defecto
}: ModalAlertProps) {
  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000040",
      }}
    >
      <Animated.View
        entering={SlideInDown}
        style={{
          width: "90%",
          height: "95%",
          backgroundColor: "white",
          padding: 20,
        }}
      >
        <XStack justify="space-between" alignItems="center" theme={'blue'} >
          <H4 mb="$2">{titulo}</H4>

          <Link href="../" asChild>
            <Button
              size="$4"
              circular
              icon={<XCircle size="$3" color={"$red10"} />}
              theme={"red"}
            />
          </Link>
        </XStack>
        {children}

        {showBackButton && <View style={{ marginTop: 20 }}></View>}
      </Animated.View>
    </Animated.View>
  );
}