import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface UploadImageProps {
  imageUrl?: string;
}

const UploadImage: React.FC<UploadImageProps> = ({ imageUrl }) => {
  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={require('@/assets/user-profile.png')} // Imagen de fallback si no hay URL
          style={styles.image}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    overflow: 'hidden',
    width: 60,
    height: 60,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});

export default UploadImage;
