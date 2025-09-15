import { Calendar, Clock, MapPin } from '@tamagui/lucide-icons';
import { Card, Text, XStack, YStack } from 'tamagui';
import { ImagenMetaData } from '../../../domain/interfaces/visita-imagen-metadata.interfase';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

const FotoMetadata = ({ imagen }: { imagen: ImagenMetaData }) => {
  // región a partir de los datos de la foto
  const region = {
    latitude: imagen.latitude || 0,
    longitude: imagen.longitude || 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <Card
      bg={"#ffffffdd"}
      p={4}
      borderRadius={10}
      position="absolute"
      bottom={10}
      left={10}
      width={"95%"}
    >
      <XStack gap={2}>
        <Card  style={FotoMetadataStyles.mapContainer} flex={1.2} bg={'red'}>
          <MapView
            style={FotoMetadataStyles.map}
            region={region}
          >
            <Marker
              coordinate={{
                latitude: imagen.latitude || 0,
                longitude: imagen.longitude || 0,
              }}
            />
          </MapView>
        </Card>
        <Card  style={FotoMetadataStyles.mapContainer} flex={1} bg={'blue'}>
        <YStack gap={4} flex={1} bg={'blue'}>
          <XStack items="center" gap={6} >
            <MapPin size={16} color="red" />
            <Text wordWrap='normal'>{imagen.localizacionNombre?.slice(0, 20) || "Ubicación desconocida"}</Text>
          </XStack>

          <XStack items="center" gap={6}>
            <Calendar size={16} color="black" />
            <Text>{imagen.fecha}</Text>
          </XStack>

          <XStack items="center" gap={6}>
            <Clock size={16} color="black" />
            <Text>{imagen.hora}</Text>
          </XStack>
        </YStack>
        </Card>
        
      </XStack>

    </Card>
  );
};

export const FotoMetadataStyles = StyleSheet.create({
    mapContainer: {
    width: "100%",
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default FotoMetadata;
