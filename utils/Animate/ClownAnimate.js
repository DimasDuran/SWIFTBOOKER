import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export default function ControllingAnimationProgress({
  onAnimationFinish, 
  loop = false, 
  speed = 1,
}) {
  const animationProgress = useRef(new Animated.Value(0));
  const animationRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(true); 

  useEffect(() => {
  const animation = Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 6000,
      easing: Easing.linear,
      useNativeDriver: true, 
    });

    animationRef.current = animation;
    animation.start();

    setShowConfetti(true);

    return () => {
      animationRef.current?.stop();
    };
  }, [speed]);

  const handleAnimationFinish = () => {
    if (loop) {
      animationProgress.current.setValue(0);
      animationRef.current?.start();
    } else {
      onAnimationFinish && onAnimationFinish();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <AnimatedLottieView
          style={styles.lottie}
          source={require('./party-clown.json')}
          progress={animationProgress.current}
          onAnimationFinish={handleAnimationFinish}
          loop
          speed={speed}
        />
        <Text style={styles.successMessage}>Successfully scheduled! 🎉</Text>
        <Text style={styles.subMessage}>Your appointment has been scheduled correctly.</Text>
      </View>
      {showConfetti && (
        <ConfettiCannon
          count={900}
          autoStart

          origin={{ x: 0, y: 0 }}
          fadeOut={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  animationContainer: {
    alignSelf: 'center',
    marginBottom: '50%',
  },
  lottie: {
    height: 300,
    width: 300,
    alignSelf: 'center',
  },
  successMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  subMessage: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
});
