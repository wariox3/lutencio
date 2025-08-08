import { Camera as CameraIcons, Circle } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { memo, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { Button, H4, Text, View } from "tamagui";
import * as MediaLibrary from 'expo-media-library';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Location from 'expo-location';

const spModes = ["percent", "constant", "fit", "mixed"] as const;

// Función para obtener dirección usando API alternativa (Nominatim de OpenStreetMap)
const getAddressFromCoordinates = async (
  latitude: number, 
  longitude: number, 
  setLocation: (location: string) => void
): Promise<void> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'LutencioMobile/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      const addressParts = [
        address.road || address.pedestrian || address.path,
        address.house_number,
        address.neighbourhood || address.suburb,
        address.city || address.town || address.village,
        address.state || address.region
      ].filter(Boolean);
      
      if (addressParts.length > 0) {
        setLocation(addressParts.join(', '));
      } else if (data.display_name) {
        // Si no hay partes específicas, usar el nombre completo pero limitado
        const displayName = data.display_name.split(',').slice(0, 3).join(', ');
        setLocation(displayName);
      } else {
        throw new Error('No address data available');
      }
    } else {
      throw new Error('No address found in response');
    }
  } catch (error) {
    console.log('Error en API Nominatim:', error);
    throw error;
  }
};

interface OverlayData {
  location?: string;
  date: string;
  time: string;
  temperature?: string;
}

interface CamaraConOverlayProps {
  onCapture: (uri: string) => void;
  overlayData?: OverlayData;
  showOverlay?: boolean;
}

export const CamaraConOverlay = ({
  onCapture,
  overlayData,
  showOverlay = true,
}: CamaraConOverlayProps) => {
  const [position, setPosition] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modal] = React.useState(true);
  const [snapPointsMode] = React.useState<(typeof spModes)[number]>("mixed");
  const snapPoints = ["100%"];

  return (
    <>
      <Button
        icon={<CameraIcons size="$2" />}
        onPress={() => setOpen(true)}
      ></Button>

      <Sheet
        forceRemoveScrollEnabled={open}
        modal={modal}
        open={open}
        onOpenChange={setOpen}
        snapPoints={snapPoints}
        snapPointsMode={snapPointsMode}
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          bg="$shadow6"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Sheet.Handle />
        <Sheet.Frame>
          <SheetContentsCamaraConOverlay 
            setOpen={setOpen} 
            onCapture={onCapture}
            overlayData={overlayData}
            showOverlay={showOverlay}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

const SheetContentsCamaraConOverlay = memo(({ 
  setOpen, 
  onCapture, 
  overlayData,
  showOverlay 
}: {
  setOpen: (open: boolean) => void;
  onCapture: (uri: string) => void;
  overlayData?: OverlayData;
  showOverlay: boolean;
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState<{uri: string, overlayData: any} | null>(null);
  
  const cameraRef = useRef<any>(null);
  const viewShotRef = useRef<any>(null);
  const [facing] = useState<CameraType>("back");

  useEffect(() => {
    (async () => {
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaStatus.status === 'granted');
      
      // Obtener ubicación si se requiere overlay
      if (showOverlay) {
        setLocationLoading(true);
        setLocationError(null);
        
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            
            // Intentar geocodificación inversa primero
            let addressFound = false;
            
            try {
              const address = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
              
              if (address && address[0]) {
                const addressStr = [
                  address[0].street,
                  address[0].streetNumber,
                  address[0].city,
                  address[0].region
                ].filter(Boolean).join(', ');
                
                if (addressStr.trim()) {
                  setCurrentLocation(addressStr);
                  addressFound = true;
                }
              }
            } catch (geocodeError) {
              console.log('Error en geocodificación nativa:', geocodeError);
            }
            
            // Si no se pudo obtener dirección, intentar con API alternativa
            if (!addressFound) {
              try {
                await getAddressFromCoordinates(
                  location.coords.latitude, 
                  location.coords.longitude,
                  setCurrentLocation
                );
                addressFound = true;
              } catch (apiError) {
                console.log('Error en API alternativa:', apiError);
              }
            }
            
            // Como último recurso, usar coordenadas formateadas
            if (!addressFound) {
              const coords = `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;
              setCurrentLocation(`Lat: ${location.coords.latitude.toFixed(4)}, Lng: ${location.coords.longitude.toFixed(4)}`);
            }
          } else {
            setLocationError('Permisos de ubicación denegados');
            setCurrentLocation('Permisos de ubicación denegados');
          }
        } catch (error) {
          console.log('Error obteniendo ubicación:', error);
          setLocationError('Error obteniendo ubicación');
          setCurrentLocation('Error obteniendo ubicación');
        } finally {
          setLocationLoading(false);
        }
      }
    })();
  }, [showOverlay]);

  if (!permission && !hasMediaLibraryPermission) {
    return (
      <View px="$4">
        <H4 mb="$2">Información</H4>
        <Text mb="$4">No se cuenta con el permiso de la cámara</Text>
      </View>
    );
  }

  if (!permission?.granted && !hasMediaLibraryPermission) {
    return (
      <View px="$4">
        <H4 mb="$2">Información</H4>
        <Text mb="$4">Necesitamos su permiso para mostrar la cámara y galería.</Text>
        <Button onPress={requestPermission} variant="outlined">
          Conceder permiso
        </Button>
      </View>
    );
  }

  const tomarFoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        
        if (showOverlay) {
          // Procesar automáticamente con overlay
          await procesarFotoConOverlay(photo.uri);
        } else {
          onCapture(photo.uri);
          setOpen(false);
        }
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
    }
  };
  
  const procesarFotoConOverlay = async (photoUri: string) => {
    try {
      // Crear overlay data con la información actual
      const dateTime = getCurrentDateTime();
      const finalOverlayData = {
        location: overlayData?.location || currentLocation || (locationLoading ? 'Obteniendo ubicación...' : 'Ubicación no disponible'),
        date: overlayData?.date || dateTime.date,
        time: overlayData?.time || dateTime.time,
        temperature: overlayData?.temperature || '25', // Valor por defecto
      };
      
      // Establecer datos para procesamiento invisible
      setProcessingImage({ uri: photoUri, overlayData: finalOverlayData });
      
      // Esperar un momento para que se renderice el componente invisible
      setTimeout(async () => {
        try {
          if (viewShotRef.current) {
            const processedUri = await captureRef(viewShotRef.current, {
              format: 'jpg',
              quality: 0.9,
            });
            setProcessingImage(null);
            onCapture(processedUri);
            setOpen(false);
          }
        } catch (captureError) {
          console.error('Error capturando imagen con overlay:', captureError);
          setProcessingImage(null);
          onCapture(photoUri);
          setOpen(false);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error procesando foto con overlay:', error);
      // En caso de error, entregar la foto original
      onCapture(photoUri);
      setOpen(false);
    }
  };



  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('es-ES'),
      time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // Componente invisible para procesar imagen con overlay
  const renderInvisibleProcessor = () => {
    if (!processingImage) return null;
    
    return (
      <View style={styles.invisibleProcessor}>
        <ViewShot ref={viewShotRef} style={styles.viewShotContainer}>
          <Image source={{ uri: processingImage.uri }} style={styles.previewImage} />
          
          {/* Overlay */}
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>📍 {processingImage.overlayData.location}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.overlayText}>📅 {processingImage.overlayData.date}</Text>
            <Text> - </Text>
            <Text style={styles.overlayText}>🕒 {processingImage.overlayData.time}</Text>
            </View>
          </View>
        </ViewShot>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
          {/* Indicador de estado de ubicación */}
          {showOverlay && (
            <View style={styles.locationStatus}>
              <Text style={styles.locationStatusText}>
                {locationLoading ? '📍 Obteniendo ubicación...' : 
                 locationError ? '❌ Error de ubicación' :
                 currentLocation ? '✅ Ubicación obtenida' : '📍 Sin ubicación'}
              </Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Button
                onPress={tomarFoto}
                size="$4"
                circular
                color={"$red10"}
                theme={"red"}
                icon={
                  <Circle
                    size="$4"
                    color={'$red10'}
                  />
                }
              />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
      
      {/* Componente invisible para procesar imagen con overlay */}
      {renderInvisibleProcessor()}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  previewContainer: {
    flex: 1,
    padding: 16,
  },
  viewShotContainer: {
    width: '100%',
    aspectRatio: 3/4,
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    width: '90%',
    bottom: 10,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  overlayText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
    fontWeight: '500',
  },
  previewButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  locationStatus: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    padding: 8,
    zIndex: 1,
  },
  locationStatusText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  invisibleProcessor: {
    position: 'absolute',
    top: -10000, // Fuera de la pantalla
    left: -10000,
    width: 300,
    height: 400,
    opacity: 0,
  },
});
