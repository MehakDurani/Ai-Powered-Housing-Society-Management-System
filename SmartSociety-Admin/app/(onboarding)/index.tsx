// app/(onboarding)/index.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  FadeIn,
} from 'react-native-reanimated';
import { OnboardingSlide } from '../../src/components/onboarding/OnboardingSlide';
import { Button } from '../../src/components/ui/Button';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/theme';
import { useAuth } from '../../src/contexts/AuthContext';

const { width } = Dimensions.get('window');

// Import your Lottie files here
// Make sure to add these files in assets/animations/
const onboardingData = [
  {
    id: '1',
    animationSource: require('../../assets/animations/smart.json'),
    title: 'Smart Society Management',
    description:
      'Everything you need to manage your society life in one place. Stay connected, informed, and organized.',
    accentColor: Colors.primary[500],
    bullets: ['Dashboard', 'Updates', 'Directory'],
  },
  {
    id: '2',
    animationSource: require('../../assets/animations/chatbot.json'),
    title: 'AI-Powered Chatbot',
    description:
      'Get instant answers to your queries. Our smart assistant is available 24/7 to help you with bills, complaints, and more.',
    accentColor: '#6366F1',
    bullets: ['24/7 Help', 'Quick Replies', 'Smart Support'],
  },
  {
    id: '3',
    animationSource: require('../../assets/animations/bill.json'),
    title: 'Seamless Bill Payments',
    description:
      'Pay your society bills securely with just a few taps. Track payments, view history, and never miss a due date.',
    accentColor: Colors.primary[500],
    bullets: ['Quick Pay', 'History', 'Reminders'],
  },
  {
    id: '4',
    animationSource: require('../../assets/animations/events.json'),
    title: 'Announcements and Events',
    description:
      'Stay updated with important announcements and never miss society events. Get notified instantly.',
    accentColor: '#6366F1',
    bullets: ['Alerts', 'Calendar', 'Notices'],
  },
  {
    id: '5',
    animationSource: require('../../assets/animations/complaints.json'),
    title: 'Complaints and Suggestions',
    description:
      'Easily submit complaints or suggestions and track their resolution. Your voice matters.',
    accentColor: Colors.primary[500],
    bullets: ['Submit', 'Track', 'Resolve'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    await setHasCompletedOnboarding(true);
    router.replace('/(auth)/login');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <LinearGradient
      colors={[Colors.background.primary, Colors.background.tertiary, Colors.primary[50]]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* Skip Button */}
        {currentIndex < onboardingData.length - 1 && (
          <Animated.View entering={FadeIn.duration(600)} style={styles.skipContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Onboarding Slides */}
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={({ item, index }) => (
            <OnboardingSlide
              animationSource={item.animationSource}
              title={item.title}
              description={item.description}
              index={index}
              accentColor={item.accentColor}
              bullets={item.bullets}
            />
            
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
        />

        
        {/* Bottom Section */}
        <View style={styles.bottomContainer}>
          {/* Enhanced Pagination Dots */}
          <View style={styles.paginationContainer}>
            {onboardingData.map((item, index) => {
              const dotStyle = useAnimatedStyle(() => {
                const isActive = index === currentIndex;
                return {
                  width: withSpring(isActive ? 40 : 10),
                  height: 10,
                  backgroundColor: isActive
                    ? item.accentColor
                    : Colors.neutral[300],
                  transform: [
                    {
                      scale: withSpring(isActive ? 1 : 0.8),
                    },
                  ],
                };
              });

              return (
                <Animated.View key={index} style={[styles.dot, dotStyle]} />
              );
            })}
          </View>

          {/* Enhanced Button */}
          <Button
            title={
              currentIndex === onboardingData.length - 1
                ? '🚀 Get Started'
                : 'Next →'
            }
            onPress={handleNext}
            fullWidth
            style={styles.button}
          />

          {/* Progress Text */}
          <Text style={styles.progressText}>
            {currentIndex + 1} of {onboardingData.length}
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  skipContainer: {
    position: 'absolute',
    top: Spacing.xxl,
    right: Spacing.lg,
    zIndex: 10,
  },
  skipButton: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  skipText: {
    ...Typography.body1,
    color: Colors.text.secondary,
    fontWeight: '700',
  },
  bottomContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xs,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  dot: {
    borderRadius: BorderRadius.sm,
  },
  button: {
    marginTop: Spacing.md,
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: Spacing.md,
    fontWeight: '600',
  },
});