import { XCircle } from "@tamagui/lucide-icons";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  ListRenderItem,
} from "react-native";
import { Button, Text, View, YStack } from "tamagui";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 110;
const CARD_HEIGHT = 180;

interface Imagen {
  uri: string;
}

const obtenerPesoImagen = async (uri: string) => {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists && info.size) {
      const kb = info.size / 1024;
      const mb = kb / 1024;
      return mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(0)} KB`;
    }
  } catch (error) {
    console.log("Error obteniendo peso:", error);
  }
  return "N/D";
};

const EntregaImagenesPreview = ({
  arrImagenes,
  removerFoto,
}: {
  arrImagenes: Imagen[];
  removerFoto?: (index: number) => void;
}) => {
  const [pesos, setPesos] = useState<Record<string, string>>({});

  useEffect(() => {
    const cargarPesos = async () => {
      const nuevosPesos: Record<string, string> = {};
      for (const img of arrImagenes) {
        if (img.uri && !pesos[img.uri]) {
          const peso = await obtenerPesoImagen(img.uri);
          nuevosPesos[img.uri] = peso;
        }
      }
      if (Object.keys(nuevosPesos).length > 0) {
        setPesos((prev) => ({ ...prev, ...nuevosPesos }));
      }
    };
    cargarPesos();
  }, [arrImagenes]);

  const renderItem: ListRenderItem<Imagen> = useCallback(
    ({ item, index }) => (
      <View
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          marginRight: 20,
          borderRadius: 16,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <ImageBackground
          source={{ uri: item.uri }}
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
          imageStyle={{ borderRadius: 16 }}
        >
          {/* Gradiente sutil para contraste del texto */}
          <LinearGradient
            colors={["transparent", "black"]}
            start={{ x: 0, y: 0.4 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}
          />

          {/* Botón de eliminar */}
          {removerFoto && (
            <Button
              size="$3"
              circular
              icon={<XCircle size="$2" color="red" />}
              onPress={() => removerFoto(index)}
              bg="rgba(255,255,255,0.85)"
              position="absolute"
              t={8}
              r={8}
              z={2}
            />
          )}

          {/* Peso en la esquina inferior derecha */}
          <Text
            color="white"
            fontSize={12}
            position="absolute"
            b={8}
            r={12}
            opacity={0.9}
          >
            {pesos[item.uri] ?? "Calculando..."}
          </Text>
        </ImageBackground>
      </View>
    ),
    [removerFoto, pesos]
  );

  const validImages = arrImagenes.filter((img) => !!img.uri);

  return (
    <View>
      <FlatList
        horizontal
        data={validImages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        decelerationRate="fast"
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={5}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH + 20,
          offset: (CARD_WIDTH + 20) * index,
          index,
        })}
      />
    </View>
  );
};

export default memo(EntregaImagenesPreview);
