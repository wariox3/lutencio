import { useAppDispatch } from "@/src/application/store/hooks";
import { ScanQrCode, Search } from "@tamagui/lucide-icons";
import React from "react";
import { Input, XStack } from "tamagui";
import { actualizarFiltros } from "../../../application/slice/entrega.slice";

const InputFiltros = () => {
  const dispatch = useAppDispatch();

  const filtrarVisitas = (valor: string) => {
    console.log(valor);

    dispatch(
      actualizarFiltros({
        guia: Number(valor) || 0,
        numero: Number(valor) || 0,
      })
    );
  };

  return (
    <XStack
      position="relative"
      bg={"white"}
      t={20}
      z={99}
      items={"center"}
      gap={"$2"}
      p={"$3"}
      borderStyle="solid"
      borderColor={"gray"}
      borderRadius="$4"
      shadowColor={"$accent1"}
    >
      <Search size={"$1.5"} opacity={0.5}></Search>
      <Input
        flex={1}
        placeholder="Buscar numero o guía"
        unstyled
        keyboardType="number-pad"
        onChangeText={(valor) => filtrarVisitas(valor)}
      ></Input>
      <ScanQrCode size={"$1.5"}></ScanQrCode>
    </XStack>
    // <View>
    //   <XStack justify="space-between">
    //     <H4 mb="$2">Filtrar Visitas </H4>
    //     <Button
    //       size="$4"
    //       circular
    //       icon={<XCircle size="$3" color={"$red10"} />}
    //       onPress={close}
    //       theme={"red"}
    //     />
    //   </XStack>
    //   <YGroup size="$4" gap="$4">
    //     <H6>Utiliza los filtros para encontrar visitas específicas</H6>
    //     <BasicInput
    //       name="guia"
    //       control={control}
    //       label="Guía"
    //       isRequired={false}
    //       keyboardType="number-pad"
    //       placeholder="Buscar por guia"
    //     />
    //     <BasicInput
    //       name="numero"
    //       control={control}
    //       label="Número"
    //       isRequired={false}
    //       keyboardType="number-pad"
    //       placeholder="Buscar por número"
    //     />
    //     <Button
    //       theme="blue"
    //       onPress={(filtrarEntregas(close))}
    //       mb={"$2.5"}
    //     >
    //       Filtrar
    //     </Button>
    //   </YGroup>
    // </View>
  );
};

export default InputFiltros;
