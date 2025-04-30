import BtnAcciones from "@/components/ui/comun/BtnAcciones";
import EntregaSinPermisoLocalizacion from "@/components/ui/entrega/entregaSinPermisoLocalizacion";
import EntregasSinElementos from "@/components/ui/entrega/entregasSinElementos";
import React from "react";
import { FlatList, SafeAreaView } from "react-native";
import { Card, Text } from "tamagui";
import useVisitaListaViewModel from "../../application/view-model/use-visita-lista.view-model";

export default function VisitaListaScreen() {
  const {
    arrEntregas,
    gestionEntrega,
    permisoLocalizacion,
    entregasSeleccionadas,
  } = useVisitaListaViewModel();
  //   const navigation = useNavigation();
  //   const dispatch = useDispatch();
  //   const arrEntregas = useSelector(obtenerEntregasPendientesOrdenadas);
  //   const usuario_id = useSelector(obtenerUsuarioId);
  //   const entregasSeleccionadas = useSelector(obtenerEntregasSeleccionadas);
  //   AsyncStorage.setItem("usuario_id", `${usuario_id}`);

  //   const [permisoLocalizacion, setPermisoLocalizacion] = useState<string | null>(
  //     null
  //   );

  //   useEffect(() => {
  //     async function getCurrentLocation() {
  //       let { status } = await Location.requestForegroundPermissionsAsync();
  //       setPermisoLocalizacion(status);
  //       if (status === "granted") {
  //         navigation.setOptions({
  //           headerRight: () => <EntregaOpciones />,
  //         });
  //       }
  //     }

  //     getCurrentLocation();
  //   }, [navigation]);

  //     useFocusEffect(
  //       useCallback(() => {
  //         gestionEntregas()
  //       }, [])
  //     );

  //     const gestionEntregas = () => {
  //       dispatch(cambiarEstadoSeleccionadoATodas())
  //       dispatch(limpiarEntregaSeleccionada());
  //     }

  //   const gestionEntrega = (id: number) => {
  //     if (entregasSeleccionadas.includes(id)) {
  //       dispatch(quitarEntregaSeleccionada(id));
  //       dispatch(cambiarEstadoSeleccionado(id));
  //     } else {
  //       dispatch(seleccionarEntrega(id));
  //       dispatch(cambiarEstadoSeleccionado(id));
  //     }
  //   };

  if (permisoLocalizacion !== "granted")
    return <EntregaSinPermisoLocalizacion></EntregaSinPermisoLocalizacion>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <BtnAcciones
        visualizarCantidadSeleccionada={entregasSeleccionadas.length > 0}
        cantidadSeleccionada={entregasSeleccionadas.length}
      ></BtnAcciones>
      <FlatList
        data={arrEntregas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Card
            p="$3"
            mx="$2"
            mt={"$2"}
            onPress={() => gestionEntrega(item.id)}
            bg={item.seleccionado ? "#f89e6d" : null}
          >
            <Text>ID: {item.id}</Text>
            <Text>Destinatario: {item.destinatario}</Text>
            <Text>Dirección: {item.destinatario_direccion}</Text>
            <Text>Fecha: {item.fecha}</Text>
            {item.estado_entregado ? <Text>Entregado</Text> : null}
          </Card>
        )}
        ListEmptyComponent={<EntregasSinElementos />}
      />
    </SafeAreaView>
  );
}
