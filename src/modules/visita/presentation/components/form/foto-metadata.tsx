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
      width={"80%"}
    >
      <XStack gap={2} flex={1}>
        <Card borderRadius={10} flex={2} >
          <MapView
            style={FotoMetadataStyles.map}
            initialRegion={region}
          >
            <Marker
              coordinate={{
                latitude: imagen.latitude || 0,
                longitude: imagen.longitude || 0,
              }}
            />
          </MapView>
        </Card>
        
      <YStack gap={4} mt={8}>
        <XStack items="center" gap={6}>
          <MapPin size={16} color="red" />
          <Text>{imagen.localizacionNombre?.slice(0, 25) || "Ubicación desconocida"}</Text>
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
      </XStack>

    </Card>
  );
};

export const FotoMetadataStyles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default FotoMetadata;
