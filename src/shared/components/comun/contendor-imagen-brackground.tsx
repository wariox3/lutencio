import React, { ReactNode } from 'react';
import { ImageBackground, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

interface ContenedorImagenBackgroundProps {
  children: ReactNode;
  source: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
}

const ContenedorImagenBackground: React.FC<ContenedorImagenBackgroundProps> = ({ 
  children,
  source,
  style   
}) => {
  return (
    <ImageBackground
      source={source}
      resizeMode="cover"
      style={[{ flex: 1 }, style]}
    >
      {children}
    </ImageBackground>
  );
};

export default ContenedorImagenBackground;