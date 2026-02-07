// app/(auth)/login.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInDown,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../src/theme';
import { auth, db } from '../../src/config/firebase';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const lottieRef = useRef<LottieView>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    lottieRef.current?.play();
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (!userDoc.exists()) {
        await auth.signOut();
        Alert.alert('Error', 'User data not found. Please contact admin.');
        setIsLoading(false);
        return;
      }

      const userData = userDoc.data();

      if (!userData.isApproved) {
        await auth.signOut();
        Alert.alert(
          'Account Pending Approval',
          'Your account is pending admin approval. Please wait for approval to access the app.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      if (!userData.isActive) {
        await auth.signOut();
        Alert.alert('Account Inactive', 'Your account has been deactivated. Please contact admin.');
        setIsLoading(false);
        return;
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred during login';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later';
      }

      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primary[400], Colors.primary[600], Colors.primary[700]]}
          style={styles.topSection}
        >
          {/* Decorative Circles */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <SafeAreaView style={styles.topContent}>
            <Animated.View entering={FadeInUp.duration(1000)} style={styles.animationContainer}>
              <LottieView
                ref={lottieRef}
                source={require('../../assets/animations/auth.json')} // Add your login Lottie
                style={styles.lottieAnimation}
                autoPlay
                loop
                speed={0.8}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(200).duration(800)}>
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.welcomeSubtitle}>Sign in to continue to Smart Society</Text>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>

        {/* White Drawer Container */}
        <Animated.View
          entering={SlideInDown.duration(1000).springify()}
          style={styles.drawerContainer}
        >
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Sign In</Text>

                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="mail-outline"
                  error={errors.email}
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  isPassword
                  icon="lock-closed-outline"
                  error={errors.password}
                />

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <Button
                  title="Sign In"
                  onPress={handleLogin}
                  isLoading={isLoading}
                  fullWidth
                  style={styles.loginButton}
                />

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Sign Up Link */}
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                    <Text style={styles.signupLink}>Create Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  topSection: {
    height: height * 0.33,
    borderBottomLeftRadius: BorderRadius.xl * 2,
    borderBottomRightRadius: BorderRadius.xl * 2,
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -100,
    right: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -50,
    left: -50,
  },
  topContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    zIndex: 1,
  },
  animationContainer: {
    width: 200,
    height: 150,
    marginTop: -20,
  },
  lottieAnimation: {
    width: '100%',
    height: '105%',
  },
  welcomeTitle: {
    ...Typography.h1,
    color: Colors.text.inverse,
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  welcomeSubtitle: {
    ...Typography.body1,
    color: Colors.text.inverse,
    textAlign: 'center',
    opacity: 0.9,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: BorderRadius.xl * 2,
    borderTopRightRadius: BorderRadius.xl * 2,
    paddingTop: Spacing.md,
    ...Shadows.large,
    shadowColor: Colors.primary[500],
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.neutral[300],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  formContainer: {
    flex: 1,
  },
  formTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xl,
    fontWeight: '700',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    ...Typography.body2,
    color: Colors.primary[600],
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: Spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.light,
  },
  dividerText: {
    ...Typography.body2,
    color: Colors.text.tertiary,
    marginHorizontal: Spacing.md,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  signupText: {
    ...Typography.body1,
    color: Colors.text.secondary,
  },
  signupLink: {
    ...Typography.body1,
    color: Colors.primary[600],
    fontWeight: '700',
  },
});