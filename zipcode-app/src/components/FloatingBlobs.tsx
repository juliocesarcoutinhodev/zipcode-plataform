import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { ZipSearchColors } from '@/constants/theme';

export function FloatingBlobs() {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (anim: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ]),
      );

    createLoop(anim1, 8000).start();
    createLoop(anim2, 10000).start();
    createLoop(anim3, 12000).start();
  }, [anim1, anim2, anim3]);

  const translateY1 = anim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });
  const translateX1 = anim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const translateY2 = anim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  });
  const translateX2 = anim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const translateY3 = anim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });
  const translateX3 = anim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.blob,
          styles.blob1,
          { transform: [{ translateX: translateX1 }, { translateY: translateY1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          styles.blob2,
          { transform: [{ translateX: translateX2 }, { translateY: translateY2 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          styles.blob3,
          { transform: [{ translateX: translateX3 }, { translateY: translateY3 }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blob1: {
    width: 300,
    height: 300,
    top: -60,
    left: -60,
    backgroundColor: 'rgba(139,92,246,0.15)',
  },
  blob2: {
    width: 250,
    height: 250,
    top: '30%',
    right: -40,
    backgroundColor: 'rgba(99,102,241,0.12)',
  },
  blob3: {
    width: 200,
    height: 200,
    bottom: -50,
    left: '20%',
    backgroundColor: 'rgba(6,182,212,0.08)',
  },
});
