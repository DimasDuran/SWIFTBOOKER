import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import LottieView from 'lottie-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export default function ControllingAnimationProgress({
  onAnimationFinish, // Callback function for animation completion
  loop = false, // Whether to loop the animation
  speed = 1, // Animation speed
}) {
  const animationProgress = useRef(new Animated.Value(0));
  const animationRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(true); // Mostrar confetti desde el inicio

  useEffect(() => {
    // Iniciar la animación de Lottie
    const animation = Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 5000 * speed,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    animationRef.current = animation;
    animation.start();

    // Mostrar el confetti al mismo tiempo que la animación comienza
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AnimatedLottieView
        style={{ height: 300, width: 300, alignSelf: 'center', marginTop: '30%' }}
        source={require('./party-clown.json')}
        progress={animationProgress.current}
        onAnimationFinish={handleAnimationFinish}
        loop
        speed={speed}
      />

      {showConfetti && (
        <ConfettiCannon
          count={500} 
          origin={{x: 0, y: 0}}
          fadeOut={true} 
        />
      )}
    </View>
  );
}
