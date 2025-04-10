import Titulo from "@/components/ui/comun/Titulo";
import Volver from "@/components/ui/navegacion/volver";
import { obtenerEntregasPendientesOrdenadas } from "@/store/selects/entrega";
import { ArrowLeftCircle, ArrowRightCircle } from "@tamagui/lucide-icons";
import * as Location from "expo-location";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Button, Card, H6, Text, View, XStack } from "tamagui";

const { width } = Dimensions.get("window");

const Index = () => {
  const navigation = useNavigation();
  const [region, setRegion] = useState<Region | null>(null);
  const entregasSeleccionadas = useSelector(obtenerEntregasPendientesOrdenadas);
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const flatListRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (entregasSeleccionadas.length > 0) {
      // Crear array de coordenadas para la ruta
      const coords = entregasSeleccionadas.map((entrega) => ({
        latitude: entrega.latitud,
        longitude: entrega.longitud,
      }));
      setCoordinates(coords);
    }
  }, [entregasSeleccionadas]);

  const scrollTo = (direction: "left" | "right") => {
    let newIndex = currentIndex + (direction === "right" ? 1 : -1);

    // Evitar que se salga del rango
    newIndex = Math.max(
      0,
      Math.min(newIndex, entregasSeleccionadas.length - 1)
    );
    setCurrentIndex(newIndex);

    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {entregasSeleccionadas.length > 0 ? (
        <>
          <Titulo texto="Mapa"></Titulo>
          <View style={styles.mapContainer}>
            {region ? (
              <MapView
                style={styles.map}
                provider="google"
                initialRegion={region}
                showsUserLocation={true}
              >
                <Marker coordinate={region} />

                {entregasSeleccionadas[currentIndex] ? (
                  <>
                    <Marker
                      coordinate={{
                        latitude: entregasSeleccionadas[currentIndex].latitud,
                        longitude: entregasSeleccionadas[currentIndex].longitud,
                      }}
                    />
                    <MapViewDirections
                      origin={{
                        latitude: region.latitude,
                        longitude: region.latitude,
                      }}
                      destination={{
                        latitude: entregasSeleccionadas[currentIndex].latitud,
                        longitude: entregasSeleccionadas[currentIndex].longitud,
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
              <ActivityIndicator size="large" style={styles.loader} />
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
              icon={<ArrowLeftCircle size={"$2"}></ArrowLeftCircle>}
            ></Button>
            <FlatList
              ref={flatListRef}
              data={entregasSeleccionadas}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Card width={width} padding={16}>
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
                {currentIndex + 1} de {entregasSeleccionadas.length}
              </Text>
            </View>
            <Button
              onPress={() => scrollTo("right")}
              disabled={currentIndex === entregasSeleccionadas.length - 1}
              variant="outlined"
              icon={<ArrowRightCircle size={"$2"}></ArrowRightCircle>}
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
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 0.9,
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Index;
