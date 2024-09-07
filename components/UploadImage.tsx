import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/styles/colores';

const UploadImage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const storedImage = await AsyncStorage.getItem('profile');
        if (storedImage) {
          setImage(storedImage);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadImage();
  }, []);

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      await AsyncStorage.setItem('profile', result.assets[0].uri); // Save image URI to AsyncStorage
    } else {
      alert('You did not select any image.');
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Image source={require('@/assets/user-profile.png')} style={styles.image} />
      )}
      <View style={styles.upload_button_container}>
        <TouchableOpacity onPress={addImage} style={styles.upload_button}>
          <Text style={styles.desc}>{image ? 'Edit' : 'Upload'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    borderRadius: 50,
    overflow: 'hidden',
    width: 72,
    height: 72,
  },
  upload_button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  upload_button_container: {
    opacity: 0.5,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.color_gray,
    width: '100%',
    height: '25%',
  },
  desc: {
    fontSize: 12,
    fontFamily: 'Mulish-Light',
    color: colors.color_white,
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    overflow: 'hidden',
    width: 72,
    height: 72,
  },
});

export default UploadImage;
