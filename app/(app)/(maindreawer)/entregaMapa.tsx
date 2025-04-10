import Volver from "@/components/ui/navegacion/volver";
import { Entrega } from "@/interface/entrega/entrega";
import { obtenerEntregasMapa } from "@/store/selects/entrega";
import * as Location from "expo-location";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { H4, View } from "tamagui";
import MapViewDirections from "react-native-maps-directions";

const EntregaMapa = () => {
  const navigation = useNavigation();
  const [region, setRegion] = useState<Region | null>(null);
  const entregasSeleccionadas = useSelector(obtenerEntregasMapa);
  const [coordinates, setCoordinates] = useState<any[]>([]);

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

console.log(region);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View paddingInline={"$4"} mb={"$2"}>
        <H4>Mapa</H4>
      </View>

      <View style={styles.mapContainer}>
        {region ? (
          <MapView
            style={styles.map}
            provider="google"
            initialRegion={region}
            showsUserLocation={true}
          >
            <Marker coordinate={region} />

            {entregasSeleccionadas.map((entrega: Entrega, key) => (
              <Marker
                coordinate={{
                  latitude: entrega.latitud,
                  longitude: entrega.longitud,
                }}
                key={key.toString()}
              />
            ))}

            {entregasSeleccionadas.map((entrega: Entrega, key) => (
              <MapViewDirections
                origin={{
                  latitude: region.latitude,
                  longitude: region.latitude,
                }}
                destination={{
                  latitude: entrega.latitud,
                  longitude: entrega.longitud,
                }}
                apikey={"AIzaSyDnd8eb9Pq7Dnye_vGeo4MLT389Is_NjzI"}
                strokeWidth={3}
                strokeColor="hotpink"
                optimizeWaypoints={true}
                key={key.toString()}
              />
            ))}
          </MapView>
        ) : (
          <ActivityIndicator size="large" style={styles.loader} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1, // ocupa todo el espacio restante
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

export default EntregaMapa;
