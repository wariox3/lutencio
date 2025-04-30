import { Stack } from 'expo-router';

export default function VisitasLayout() {
  return (
    <Stack>
      <Stack.Screen name="lista" options={{ title: 'Home' }} />
      <Stack.Screen name="cargar" options={{ title: 'About' }} />
      <Stack.Screen name="novedad" options={{ title: 'About' }} />
      <Stack.Screen name="pendiente" options={{ title: 'About' }} />
      {/* <Stack.Screen name="[id]" options={{ title: 'About' }} /> */}
    </Stack>
  );
}