import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function HourseAnimation() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('./Hourse.json')} 
        autoPlay 
        loop 
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent:'center'

  },
  animation: {
    width: 260,
    height: 260, 
    alignSelf:'center'
  },
});
