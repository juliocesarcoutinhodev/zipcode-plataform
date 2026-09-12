import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { ZipSearchColors } from '@/constants/theme';

interface LoadingSkeletonProps {
  visible: boolean;
}

const SKELETON_WIDTHS = [65, 80, 55, 70];

export function LoadingSkeleton({ visible }: LoadingSkeletonProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [visible, pulseAnim]);

  if (!visible) return null;

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <View style={styles.container}>
      <View style={styles.loadingRow}>
        <View style={styles.loadingDot} />
        <Animated.Text style={[styles.loadingText, { opacity }]}>
          Consultando CEP...
        </Animated.Text>
      </View>

      <View style={styles.skeletonLines}>
        {SKELETON_WIDTHS.map((width, i) => (
          <Animated.View
            key={i}
            style={[styles.skeletonLine, { width: `${width}%`, opacity }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: ZipSearchColors.glassBg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 24,
    gap: 20,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: ZipSearchColors.textSecondary,
    borderTopColor: 'transparent',
  },
  loadingText: {
    fontSize: 17,
    fontWeight: '600',
    color: ZipSearchColors.textSecondary,
  },
  skeletonLines: {
    gap: 14,
  },
  skeletonLine: {
    height: 14,
    borderRadius: 7,
    backgroundColor: ZipSearchColors.skeleton,
  },
});
