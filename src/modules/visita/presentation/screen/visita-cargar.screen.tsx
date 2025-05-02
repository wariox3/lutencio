import { BasicInput } from "@/components/ui/form/inputs/BasicInput";
import { Validaciones } from "@/constants/mensajes";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H4, Spinner, View } from "tamagui";
import useVisitaCargarViewModel from "../../application/view-model/use-visita-cargar.view-model";

const VisitaCargarScreen = () => {
  const { control, handleSubmit, cargarOrden, loading } =
    useVisitaCargarViewModel();
  //   const [mostrarAnimacionCargando, setMostrarAnimacionCargando] =
  //     useState(false);

  //   const valoresFormularioCargar = {
  //     codigo: "",
  //   };
  //   const { control, handleSubmit, reset } = useForm<FieldValues>({
  //     defaultValues: valoresFormularioCargar,
  //   });

  //   const navigation = useNavigation();

  //   const router = useRouter();
  //   const dispatch = useDispatch();

  //   useEffect(() => {
  //     // Aquí puedes realizar lógica de inicialización si es necesario.
  //     navigation.setOptions({
  //       headerLeft: () => <Volver ruta="entrega" />,
  //     });
  //   }, [navigation]);

  //   useFocusEffect(
  //     useCallback(() => {
  //       reset(valoresFormularioCargar);
  //       setMostrarAnimacionCargando(false);
  //     }, [])
  //   );

  //   const cargarOrden = async (data: FieldValues) => {
  //     setMostrarAnimacionCargando(true);
  //     reset({
  //       codigo: "",
  //     });
  //     try {
  //       const respuestaApiVerticalEntrega = await consultarApi<VerticalEntrega>(
  //         `${APIS.entrega.verticalEntrega}${data.codigo}/`,
  //         null,
  //         { requiereToken: true, method: "get" }
  //       );
  //       if (respuestaApiVerticalEntrega) {
  //         const respuestaApi = await consultarApi<ConsultarLista<Entrega>>(
  //           APIS.general.funcionalidadLista,
  //           {
  //             modelo: "RutVisita",
  //             filtros: [
  //               {
  //                 propiedad: "despacho_id",
  //                 valor1: respuestaApiVerticalEntrega.despacho_id,
  //                 operador: "exact",
  //               },
  //               {
  //                 propiedad: "estado_entregado",
  //                 operador: "exact",
  //                 valor1: false,
  //               },
  //             ],
  //           } as any,
  //           {
  //             requiereToken: true,
  //             subdominio: respuestaApiVerticalEntrega.schema_name,
  //           }
  //         );

  //         if (respuestaApi.registros.length > 0) {
  //           await AsyncStorage.setItem(
  //             "subdominio",
  //             respuestaApiVerticalEntrega.schema_name
  //           );
  //           await AsyncStorage.setItem(
  //             "despacho",
  //             `${respuestaApiVerticalEntrega.despacho_id}`
  //           );
  //           await AsyncStorage.setItem("ordenEntrega", `${data.codigo}`);

  //           dispatch(setEntregas(respuestaApi.registros));
  //           await iniciarTareaSeguimientoUbicacion();
  //         }
  //         router.navigate("/(app)/(maindreawer)/entrega");
  //       }
  //     } catch (error) {
  //       setMostrarAnimacionCargando(false);
  //     }
  //   };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View gap="$4" flex={1} paddingInline="$4">
            <H4>Vincular</H4>
            <BasicInput
              name="codigo"
              control={control}
              label="Orden de entrega"
              isRequired={true}
              placeholder="123"
              keyboardType="numeric"
              rules={{
                required: Validaciones.comunes.requerido,
              }}
            />
            <Button
              theme={loading ? "accent" : "blue"}
              icon={loading ? () => <Spinner /> : undefined}
              disabled={loading}
              onPress={handleSubmit(cargarOrden)}
            >
              Vincular
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default VisitaCargarScreen;
