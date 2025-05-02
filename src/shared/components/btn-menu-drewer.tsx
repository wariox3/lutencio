import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Menu } from '@tamagui/lucide-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const BtnMenuDrawer = () => {

    //TODO: MEJORR TIPADO CAMBIAR EN ANY POR  
    /**
        * EJEMPLO:
        * export type RootDrawerParamList = {
        *  Home: undefined;  // Pantalla Home sin parámetros
        *   Settings: undefined;
        *   // ... otras pantallas de tu drawer
        *   };
     */
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    const handleOpenMenuDrawer = () => {
        navigation.toggleDrawer(); // Esto debería funcionar si la navegación está bien configurada
    }

    return (
        <Pressable onPress={handleOpenMenuDrawer} style={{ padding: 10 }}>
            <Menu color={"black"} size={24} />
        </Pressable>
    )
}

export default BtnMenuDrawer;