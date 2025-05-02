import Volver from "@/components/ui/navegacion/volver";
import { cambiarEstadoSeleccionado, limpiarEntregaSeleccionada, seleccionarEntrega } from "@/store/reducers/entregaReducer";
import { obtenerEntregasPendientesOrdenadas } from "@/store/selects/entrega";
import { ArrowLeftCircle, ArrowRightCircle } from "@tamagui/lucide-icons";
import * as Location from "expo-location";
import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, H6, Text, View, XStack } from "tamagui";
import { gpsStyles } from "../stylesheet/gps.stylessheet";
import BtnAcciones from "@/src/shared/components/btn-acciones";

const { width } = Dimensions.get("window");

const GpsScreen = () => {
    const navigation = useNavigation();
    const [region, setRegion] = useState<Region | null>(null);
    const entregasPendientesOrdenadas = useSelector(obtenerEntregasPendientesOrdenadas);
    const [coordinates, setCoordinates] = useState<any[]>([]);
    const flatListRef = useRef<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const dispatch = useDispatch();
  
    useFocusEffect(
      useCallback(() => {
        gestionEntregas()
      }, [])
    );
  
    const gestionEntregas = () => {
      if (entregasPendientesOrdenadas.length > 0) {
        dispatch(limpiarEntregaSeleccionada());
        dispatch(seleccionarEntrega(entregasPendientesOrdenadas[0].id));
        dispatch(cambiarEstadoSeleccionado(entregasPendientesOrdenadas[0].id));
      }
    }
  
    useEffect(() => {
      navigation.setOptions({
        headerLeft: () => <Volver ruta="entrega" />,
      });
  
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Permiso de ubicación no concedido");
          return;
        }
  
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
  
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      })();
    }, [navigation]);
  
    useEffect(() => {
      if (entregasPendientesOrdenadas.length > 0) {
        // Crear array de coordenadas para la ruta
        const coords = entregasPendientesOrdenadas.map((entrega) => ({
          latitude: entrega.latitud,
          longitude: entrega.longitud,
        }));
        setCoordinates(coords);
      }
    }, [entregasPendientesOrdenadas]);
  
    const scrollTo = (direction: "left" | "right") => {
      dispatch(limpiarEntregaSeleccionada());
      let newIndex = currentIndex + (direction === "right" ? 1 : -1);
  
      // Evitar que se salga del rango
      newIndex = Math.max(
        0,
        Math.min(newIndex, entregasPendientesOrdenadas.length - 1)
      );
      setCurrentIndex(newIndex);
      dispatch(seleccionarEntrega(entregasPendientesOrdenadas[newIndex].id));
      dispatch(cambiarEstadoSeleccionado(entregasPendientesOrdenadas[newIndex].id));
  
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    };
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <BtnAcciones visualizarCantidadSeleccionada={entregasPendientesOrdenadas.length > 0} cantidadSeleccionada={1}></BtnAcciones>
        {entregasPendientesOrdenadas.length > 0 ? (
          <>
            <View style={gpsStyles.mapContainer}>
                {region ? (
                <MapView
                  style={gpsStyles.map}
                  provider="google"
                  initialRegion={region}
                  showsUserLocation={true}
                >
                  <Marker coordinate={region} />
  
                  {entregasPendientesOrdenadas[currentIndex] ? (
                    <>
                      <Marker
                        coordinate={{
                          latitude: entregasPendientesOrdenadas[currentIndex].latitud,
                          longitude: entregasPendientesOrdenadas[currentIndex].longitud,
                        }}
                      />
                      <MapViewDirections
                        origin={{
                          latitude: region.latitude,
                          longitude: region.latitude,
                        }}
                        destination={{
                          latitude: entregasPendientesOrdenadas[currentIndex].latitud,
                          longitude: entregasPendientesOrdenadas[currentIndex].longitud,
                        }}
                        apikey={"AIzaSyDnd8eb9Pq7Dnye_vGeo4MLT389Is_NjzI"}
                        strokeWidth={3}
                        strokeColor="hotpink"
                        optimizeWaypoints={true}
                      />
                    </>
                  ) : null}
                </MapView>
              ) : (
                <ActivityIndicator size="large" style={gpsStyles.loader} />
              )}
            </View>
            <XStack
              flex={0.1}
              my={"$1"}
              justify={"space-between"}
              alignItems="center"
              gap={"$4"}
            >
              <Button
                onPress={() => scrollTo("left")}
                disabled={currentIndex === 0}
                variant="outlined"
                icon={<ArrowLeftCircle size={"$2"} color={currentIndex === 0 ? 'gray' : '$black1'}></ArrowLeftCircle>}
              ></Button>
              <FlatList
                ref={flatListRef}
                data={entregasPendientesOrdenadas}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <Card width={width} padding={10}>
                    <Text>ID: {item.id}</Text>
                  </Card>
                )}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
              />
              <View>
                <Text>
                  {currentIndex + 1} de {entregasPendientesOrdenadas.length}
                </Text>
              </View>
              <Button
                onPress={() => scrollTo("right")}
                disabled={currentIndex === entregasPendientesOrdenadas.length - 1}
                variant="outlined"
                icon={<ArrowRightCircle size={"$2"} color={currentIndex === entregasPendientesOrdenadas.length - 1 ? 'gray' : '$black1'}></ArrowRightCircle>}
              ></Button>
            </XStack>
          </>
        ) : (
          <Card flex={0.1} my={"$1"} theme={"red"} padding={16}>
            <H6>No tiene orden de entrega vinculada</H6>
          </Card>
        )}
      </SafeAreaView>
    );
}

export default GpsScreen