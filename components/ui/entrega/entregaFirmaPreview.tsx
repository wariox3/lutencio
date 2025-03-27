import { XCircle } from "@tamagui/lucide-icons";
import React from "react";
import { Dimensions, ImageBackground } from "react-native";
import { Button, View } from "tamagui";

const { width } = Dimensions.get("window");

const EntregaFirmaPreview = ({
  imagen,
  RemoverFirma,
}: {
  imagen: string | null;
  RemoverFirma?: () => void;
}) => {
  return (
    <View>
      {imagen !== null ? (
        <ImageBackground
          source={{ uri: imagen }}
          imageStyle={{ borderRadius: 15 }}
          style={{
            height: 180,
            width: width - 110,
            marginVertical: 5,
            alignItems: "flex-end",
            marginRight: 20,
          }}
        >
          {RemoverFirma !== undefined ? (
            <Button
              size="$4"
              circular
              icon={<XCircle size="$3" color={"red"} />}
              onPress={() => RemoverFirma()}
            />
          ) : null}
        </ImageBackground>
      ) : null}
    </View>
  );
};

export default EntregaFirmaPreview;
