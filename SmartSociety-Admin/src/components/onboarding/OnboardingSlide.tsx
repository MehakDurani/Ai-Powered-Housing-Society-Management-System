// src/components/onboarding/OnboardingSlide.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Colors, Spacing, Typography, BorderRadius } from '../../theme';

const { width, height } = Dimensions.get('window');

interface OnboardingSlideProps {
  animationSource: any;
  title: string;
  description: string;
  index: number;
  accentColor: string;
  bullets: string[];
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  animationSource,
  title,
  description,
  index,
  accentColor,
  bullets
}) => {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    lottieRef.current?.play();
  }, []);

  return (
    <View style={styles.container}>
      {/* Decorative Background Elements */}
      <View style={styles.decorativeContainer}>
        <View style={[styles.circle, styles.circle1, { backgroundColor: accentColor + '15' }]} />
        <View style={[styles.circle, styles.circle2, { backgroundColor: Colors.primary[300] + '20' }]} />
        <View style={[styles.circle, styles.circle3, { backgroundColor: accentColor + '10' }]} />
      </View>

      {/* Lottie Animation Container */}
      <Animated.View
        entering={FadeInUp.delay(index * 100).duration(1000).springify()}
        style={styles.animationContainer}
      >
        <View style={[styles.animationCard, { borderColor: accentColor + '30' }]}>
          <LinearGradient
            colors={[Colors.background.primary, Colors.background.tertiary]}
            style={styles.animationGradient}
          >
            <LottieView
              ref={lottieRef}
              source={animationSource}
              style={styles.lottieAnimation}
              autoPlay
              loop
              speed={0.8}
            />
          </LinearGradient>
          
          {/* Decorative Corner Accents */}
          <View style={[styles.cornerAccent, styles.topLeft, { backgroundColor: accentColor }]} />
          <View style={[styles.cornerAccent, styles.topRight, { backgroundColor: accentColor }]} />
          <View style={[styles.cornerAccent, styles.bottomLeft, { backgroundColor: accentColor }]} />
          <View style={[styles.cornerAccent, styles.bottomRight, { backgroundColor: accentColor }]} />
        </View>
      </Animated.View>

      {/* Text Content */}
      <Animated.View
        entering={FadeInDown.delay(index * 100 + 300).duration(1000).springify()}
        style={styles.textContainer}
      >
        {/* Accent Line */}
        <LinearGradient
          colors={[accentColor, Colors.primary[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentLine}
        />
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        {/* Feature Pills */}
        <View style={styles.pillsContainer}>
          <View style={[styles.pill, { backgroundColor: accentColor + '20', borderColor: accentColor }]}>
            <View style={[styles.pillDot, { backgroundColor: accentColor }]} />
            <Text style={[styles.pillText, { color: accentColor }]}>{bullets[0]}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: Colors.primary[500] + '20', borderColor: Colors.primary[500] }]}>
            <View style={[styles.pillDot, { backgroundColor: Colors.primary[500] }]} />
            <Text style={[styles.pillText, { color: Colors.primary[600] }]}>{bullets[1]}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: accentColor + '20', borderColor: accentColor }]}>
            <View style={[styles.pillDot, { backgroundColor: accentColor }]} />
            <Text style={[styles.pillText, { color: accentColor }]}>{bullets[2]}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  decorativeContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    top: '40%',
    left: -75,
  },
  animationContainer: {
    marginBottom: Spacing.xxxl,
    zIndex: 1,
  },
  animationCard: {
    width: 280,
    height: 280,
    borderRadius: BorderRadius.xl * 1.5,
    borderWidth: 3,
    overflow: 'hidden',
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  animationGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  cornerAccent: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopLeftRadius: BorderRadius.md,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopRightRadius: BorderRadius.md,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomLeftRadius: BorderRadius.md,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomRightRadius: BorderRadius.md,
  },
  textContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  accentLine: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontWeight: '800',
  },
  description: {
    ...Typography.body1,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: Spacing.lg,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.xs,
  },
  pillText: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 11,
  },
});