import { Cloud, Moon, Star, Sun } from "@tamagui/lucide-icons";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, SafeAreaView } from "react-native";
import { H4, ListItem, ScrollView, YGroup } from "tamagui";
import { EntregaCargar } from "@/components/ui/entrega/entregaCargar";

export default function EntregaDreawer() {
  const navigation = useNavigation();


  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <EntregaCargar/>
      ),
    });
  }, [navigation]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView>
        <H4 mb="$2" px="$3">
          Entrega
        </H4>

        <ScrollView showsVerticalScrollIndicator={false} px='$3'>
          <YGroup
            bordered
            width={"auto"}
            flex={1}
            size="$4"
            style={{ backgroundColor: "white" }}
          >
            <YGroup.Item>
              <ListItem
                hoverTheme
                icon={Star}
                title="Star"
                subTitle="Twinkles"
              />
            </YGroup.Item>
            <YGroup.Item>
              <ListItem hoverTheme icon={Moon}>
                Moon
              </ListItem>
            </YGroup.Item>
            <YGroup.Item>
              <ListItem hoverTheme icon={Sun}>
                Sun
              </ListItem>
            </YGroup.Item>
            <YGroup.Item>
              <ListItem hoverTheme icon={Cloud}>
                Cloud
              </ListItem>
            </YGroup.Item>
          </YGroup>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
