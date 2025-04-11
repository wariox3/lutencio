import { Stack } from "expo-router";
import "react-native-reanimated";

export default function AppLayout() {

  return (
    <Stack>
      <Stack.Screen name="(login)" options={{ headerShown: false }} />
      <Stack.Screen name="(maindreawer)" options={{ headerShown: false }} />
    </Stack>
  );
}
