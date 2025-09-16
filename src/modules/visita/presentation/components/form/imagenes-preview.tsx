import { XCircle, MapPin, Calendar, Clock, Thermometer } from "@tamagui/lucide-icons";
import React from "react";
import { Dimensions, FlatList, ImageBackground } from "react-native";
import { Button, View, Text, XStack, YStack, Card } from "tamagui";
import FotoMetadata from "./foto-metadata";
import { ImagenMetaData } from "../../../domain/interfaces/visita-imagen-metadata.interfase";

const { width } = Dimensions.get("window");

const EntregaImagenesPreview = ({
  arrImagenes,
  removerFoto,
}: {
  arrImagenes: ImagenMetaData[];
  removerFoto?: (index: number) => void;
}) => {
  
  return (
    <View>
      <FlatList
        snapToInterval={width - 65}
        horizontal
        data={arrImagenes}
        renderItem={({ item, index }) => (
          <ImageBackground
            source={{ uri: item.uri }}
            imageStyle={{ borderRadius: 15 }}
            style={{
              height: 220,
              width: width - 110,
              marginVertical: 5,
              alignItems: "flex-end",
              marginRight: 20,
              overflow: "hidden",
            }}
          >
            {/* Botón para eliminar */}
            {removerFoto !== undefined ? (
              <Button
                size="$4"
                circular
                icon={<XCircle size="$3" color={"red"} />}
                onPress={() => removerFoto(index)}
                style={{ margin: 6 }}
              />
            ) : null}
            {/* <FotoMetadata imagen={item}></FotoMetadata> */}
          </ImageBackground>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default EntregaImagenesPreview;
