import { rutasApp } from '@/constants/rutas';
import { AlertTriangle, ArrowDownToLine, FileWarning, SendHorizontal } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router';
import React from 'react'
import { Button, Text, XStack } from 'tamagui'

interface BtnAccionesProps {
    visualizarCantidadSeleccionada?: boolean;
    cantidadSeleccionada?: number;
}

const BtnAcciones = ({ visualizarCantidadSeleccionada = false, cantidadSeleccionada }: BtnAccionesProps) => {
    const router = useRouter();

    const navegarFormulario = () => {
        router.push(rutasApp.entregaFormulario);
      };
    

    const renderCantidad = () =>
        visualizarCantidadSeleccionada && (
            <Text>
                ({cantidadSeleccionada})
            </Text>
        )
    
    return (
        <XStack gap="$2" justify="space-around" mt={'$2'}>
            <Button onPress={navegarFormulario} size="$4.5" theme={"blue"} icon={<ArrowDownToLine size={"$2"}></ArrowDownToLine>}>
                Entregar
                {renderCantidad()}

            </Button>
            <Button size="$4.5" theme={"yellow"} icon={<FileWarning size={"$2"}></FileWarning>}>
                Novedad
                {renderCantidad()}
            </Button>
        </XStack>
    )
}

export default BtnAcciones