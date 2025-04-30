import { EntregaOpciones } from "@/components/ui/entrega/entregaOpciones";
import { Stack } from "expo-router";

export default function VisitasLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="lista"
        options={{
          title: '',
          headerRight: () =>
            //   <ReusableSheet
            // triggerText=""
            // triggerProps={{
            //   icon: <MoreVertical size="$1.5" />,
            //   variant: "outlined"
            // }}
            // sheetContents={({ close }) => (
            <EntregaOpciones />
          //)}
          ///>
          ,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="cargar"
        options={{ title: "", headerShadowVisible: false }}
      />
      <Stack.Screen
        name="novedad"
        options={{ title: "", headerShadowVisible: false }}
      />
      <Stack.Screen
        name="pendiente"
        options={{ title: "", headerShadowVisible: false }}
      />
      {/* <Stack.Screen name="[id]" options={{ title: 'About' }} /> */}
    </Stack>
  );
}
