import Volver from "@/components/ui/navegacion/volver";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Region, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { H4, View } from "tamagui";
import * as Location from "expo-location";

const EntregaMapa = () => {
  const navigation = useNavigation();
  const [region, setRegion] = useState<Region | null>(null);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View paddingHorizontal="$4" paddingVertical="$2">
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
