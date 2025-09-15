import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { rutasApp } from "@/src/core/constants/rutas.constant";
import {
  obtenerEntregasPendientesOrdenadas,
  obtenerEntregasSeleccionadas,
} from "@/src/modules/visita/application/slice/entrega.selector";
import {
  cambiarEstadoSeleccionado,
  limpiarEntregaSeleccionada,
  seleccionarEntrega,
} from "@/src/modules/visita/application/slice/entrega.slice";
import { BotonAccion } from "@/src/shared/components/navegacion/btn-accion";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import {
  ArrowDownToLine,
  ArrowLeftCircle,
  ArrowRightCircle,
  FileWarning,
} from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import MapView, { MapMarker, Marker, Region } from "react-native-maps";
import { Button, Card, Text, View, XStack } from "tamagui";
import SinElementos from "../components/sin-elementos";
import { gpsStyles } from "../stylesheet/gps.stylessheet";

const { width } = Dimensions.get("window");

const GpsScreen = () => {
  const navigation = useNavigation();
  const [region, setRegion] = useState<Region | null>(null);
  const entregasPendientesOrdenadas = useAppSelector(
    obtenerEntregasPendientesOrdenadas
  );
  const entregasSeleccionadas = useAppSelector(obtenerEntregasSeleccionadas);
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const flatListRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useAppDispatch();
  const mapRef = useRef<MapView>(null);
  const markerRef = useRef<MapMarker>(null);
  const [markerTitle, setMarkerTitle] = useState("Título inicial");
  const [markerDescription, setMarkerDescription] = useState("Título inicial");
  const { obtenerColor } = useTemaVisual();

  useFocusEffect(
    useCallback(() => {
      gestionEntregas();
    }, [])
  );

  // // Modifica tu useEffect para usar esta función
  useEffect(() => {
    centrarMapa();
  }, [entregasPendientesOrdenadas, currentIndex, region]);

  // Agrega esta función utilitaria al inicio de tu componente
  const getRegionForCoordinates = (
    points: { latitude: number; longitude: number }[]
  ) => {
    if (points.length === 0) {
      return null;
    }

    let minX = points[0].latitude;
    let maxX = points[0].latitude;
    let minY = points[0].longitude;
    let maxY = points[0].longitude;

    points.forEach((point) => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = (maxX - minX) * 1.2; // Añade un 20% de padding
    const deltaY = (maxY - minY) * 1.2;

    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY,
    };
  };

  const gestionEntregas = () => {
    if (entregasPendientesOrdenadas.length > 0) {
      dispatch(limpiarEntregaSeleccionada());
      dispatch(seleccionarEntrega(entregasPendientesOrdenadas[0].id));
      dispatch(cambiarEstadoSeleccionado(entregasPendientesOrdenadas[0].id));
      setMarkerTitle(`${entregasPendientesOrdenadas[0].numero}`);
      setMarkerDescription(`${entregasPendientesOrdenadas[0].destinatario}`);
    }
  };

  useEffect(() => {
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
    dispatch(
      cambiarEstadoSeleccionado(entregasPendientesOrdenadas[newIndex].id)
    );

    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });

    setMarkerTitle(`${entregasPendientesOrdenadas[newIndex].numero}`); // ✅ Actualiza el estado
    setMarkerDescription(
      `${entregasPendientesOrdenadas[newIndex].destinatario.slice(0, 17)}`
    ); // ✅ Actualiza el estado

    setTimeout(() => markerRef.current?.showCallout(), 700);
  };

  const centrarMapa = () => {
    if (entregasPendientesOrdenadas[currentIndex] && mapRef.current && region) {
      const delivery = entregasPendientesOrdenadas[currentIndex];

      const points = [
        { latitude: region.latitude, longitude: region.longitude },
        { latitude: delivery.latitud, longitude: delivery.longitud },
      ];

      // Calcular la región que contiene ambos puntos
      const newRegion = getRegionForCoordinates(points);

      if (newRegion) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    }
  };

  const blurhash = "=IQcr5bI^*-:_NM|?bof%M";

  return (
    <View style={{ flex: 1, backgroundColor: obtenerColor("BLANCO", "NEGRO") }}>
      <XStack justify={"space-around"} mx="$2" mt={"$2"}>
        <BotonAccion
          onPress={() => router.navigate(rutasApp.visitaEntregar)}
          icon={<ArrowDownToLine size="$2" />}
          texto="Entregar"
          themeColor="blue"
          mostrarCantidad={entregasSeleccionadas.length > 0}
          cantidad={entregasSeleccionadas.length}
        />
        <BotonAccion
          onPress={() => router.navigate(rutasApp.visitaNovedad)}
          icon={<FileWarning size="$2" />}
          texto="Novedad"
          themeColor="yellow"
          mostrarCantidad={entregasSeleccionadas.length > 0}
          cantidad={entregasSeleccionadas.length}
        />
      </XStack>
      {entregasPendientesOrdenadas.length > 0 ? (
        <>
          <View style={gpsStyles.mapContainer}>
            {region ? (
              <MapView
                style={gpsStyles.map}
                initialRegion={region}
                showsUserLocation={true}
                ref={mapRef}
              >
                <Marker
                  coordinate={region}
                  image={require("../../../../../assets/images/marca-mapa.png")}
                />

                {entregasPendientesOrdenadas[currentIndex] ? (
                  <>
                    <Marker
                      ref={markerRef}
                      coordinate={{
                        latitude:
                          entregasPendientesOrdenadas[currentIndex].latitud,
                        longitude:
                          entregasPendientesOrdenadas[currentIndex].longitud,
                      }}
                      image={require("../../../../../assets/images/marca-mapa-azul.png")}
                      title={markerTitle}
                      description={markerDescription}
                    />
                  </>
                ) : null}
              </MapView>
            ) : (
              <View style={gpsStyles.loader}>
                <Image
                  source={require("../../../../../assets/images/mapa.gif")}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                  transition={1000}
                  style={{
                    width: 66,
                    height: 58,
                  }}
                />
                <Text>Procesando mapa</Text>
              </View>
            )}
          </View>
          <XStack
            flex={0.1}
            my={"$1"}
            justify={"space-between"}
            items="center"
            gap={"$4"}
          >
            <Button
              onPress={() => scrollTo("left")}
              disabled={currentIndex === 0}
              variant="outlined"
              icon={
                <ArrowLeftCircle
                  size={"$2"}
                  color={
                    currentIndex === 0
                      ? "rgba(131, 181, 143, 1)"
                      : "rgba(74, 177, 104, 1)"
                  }
                ></ArrowLeftCircle>
              }
            ></Button>
            <FlatList
              ref={flatListRef}
              data={entregasPendientesOrdenadas}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Card width={width} padding={10}>
                  <Text>Número: {item.numero}</Text>
                  <Text>{item.destinatario.slice(0, 17)}</Text>
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
              icon={
                <ArrowRightCircle
                  size={"$2"}
                  color={
                    currentIndex === entregasPendientesOrdenadas.length - 1
                      ? "rgba(131, 181, 143, 1)"
                      : "rgba(74, 177, 104, 1)"
                  }
                ></ArrowRightCircle>
              }
            ></Button>
          </XStack>
        </>
      ) : (
        <SinElementos></SinElementos>
      )}
    </View>
  );
};

export default GpsScreen;
