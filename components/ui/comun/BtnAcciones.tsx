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

    const navegarNovedad = () => {
        router.navigate(rutasApp.entregaNovedad);
    };


    const renderCantidad = () =>
        visualizarCantidadSeleccionada && (
            <Text>
                ({cantidadSeleccionada})
            </Text>
        )
    console.log({ visualizarCantidadSeleccionada });


    return (
        <XStack gap="$2" justify="space-around" mt={'$2'}>
            <Button 
                onPress={navegarFormulario} 
                size="$4.5"
                theme={visualizarCantidadSeleccionada ? "blue" : "accent"}
                icon={<ArrowDownToLine size={"$2"}></ArrowDownToLine>}
                disabled={!visualizarCantidadSeleccionada}>
                Entregar
                {renderCantidad()}
            </Button>
            <Button 
                onPress={navegarNovedad} 
                size="$4.5" 
                theme={visualizarCantidadSeleccionada ? "yellow" : "accent"}
                icon={<FileWarning size={"$2"}></FileWarning>}
                disabled={!visualizarCantidadSeleccionada}>
                Novedad
                {renderCantidad()}
            </Button>
        </XStack>
    )
}

export default BtnAcciones