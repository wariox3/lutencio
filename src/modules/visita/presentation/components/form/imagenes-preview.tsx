import { XCircle } from "@tamagui/lucide-icons";
import React, { memo, useCallback } from "react";
import { Dimensions, FlatList, ImageBackground, ListRenderItem } from "react-native";
import { Button, View } from "tamagui";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 110;
const CARD_HEIGHT = 180;

interface Imagen {
  uri: string;
}

const EntregaImagenesPreview = ({
  arrImagenes,
  removerFoto,
}: {
  arrImagenes: Imagen[];
  removerFoto?: (index: number) => void;
}) => {
  // Filtramos solo las que tienen uri válido (no pierdes tiempo en items vacíos)
  const validImages = arrImagenes.filter(img => !!img.uri);

  const renderItem: ListRenderItem<Imagen> = useCallback(
    ({ item, index }) => (
      <ImageBackground
        source={{ uri: item.uri }}
        imageStyle={{ borderRadius: 15 }}
        style={{
          height: CARD_HEIGHT,
          width: CARD_WIDTH,
          marginVertical: 5,
          alignItems: "flex-end",
          marginRight: 20,
        }}
      >
        {removerFoto && (
          <Button
            size="$3"
            circular
            icon={<XCircle size="$2" color="red" />}
            onPress={() => removerFoto(index)}
          />
        )}
      </ImageBackground>
    ),
    [removerFoto]
  );

  return (
    <View>
      <FlatList
        horizontal
        data={validImages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20} // coincide con marginRight
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
