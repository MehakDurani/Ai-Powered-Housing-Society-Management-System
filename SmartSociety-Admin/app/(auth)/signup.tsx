// app/(auth)/signup.tsx
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
} from 'react-native-reanimated';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../src/theme';
import { auth, db } from '../../src/config/firebase';

const { height } = Dimensions.get('window');

interface SignupFormData {
  fullName: string;
  email: string;
  phone: string;
  houseNumber: string;
  cnic: string;
  password: string;
  confirmPassword: string;
}

export default function SignupScreen() {
  const router = useRouter();
  const lottieRef = useRef<LottieView>(null);
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    phone: '',
    houseNumber: '',
    cnic: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});

  useEffect(() => {
    lottieRef.current?.play();
  }, []);

  const updateField = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+92|0)?[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber = 'House number is required';
    }

    if (!formData.cnic) {
      newErrors.cnic = 'CNIC is required';
    } else if (!/^[0-9]{13}$/.test(formData.cnic.replace(/-/g, ''))) {
      newErrors.cnic = 'CNIC must be 13 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        houseNumber: formData.houseNumber,
        cnic: formData.cnic,
        isActive: false,
        isApproved: false,
        role: 'resident',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await auth.signOut();

      Alert.alert(
        'Registration Successful!',
        'Your account has been created. Please wait for admin approval before you can log in.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } catch (error: any) {
      let errorMessage = 'An error occurred during registration';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }

      Alert.alert('Registration Failed', errorMessage);
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
          colors={[Colors.primary[500], Colors.primary[600], Colors.primary[700]]}
          style={styles.topSection}
        >
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />

          <SafeAreaView style={styles.topContent}>
            <Animated.View entering={FadeInUp.duration(1000)} style={styles.animationContainer}>
              <LottieView
                ref={lottieRef}
                source={require('../../assets/animations/auth.json')} // Add your signup Lottie
                style={styles.lottieAnimation}
                autoPlay
                loop
                speed={0.8}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(200).duration(800)}>
              <Text style={styles.welcomeTitle}>Join Smart Society</Text>
              <Text style={styles.welcomeSubtitle}>Create your account to get started</Text>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>

        <Animated.View
          entering={SlideInDown.duration(1000).springify()}
          style={styles.drawerContainer}
        >
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
                <Text style={styles.formTitle}>Create Account</Text>

                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChangeText={(value) => updateField('fullName', value)}
                  icon="person-outline"
                  error={errors.fullName}
                />

                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="mail-outline"
                  error={errors.email}
                />

                <Input
                  label="Phone Number"
                  placeholder="03XX-XXXXXXX"
                  value={formData.phone}
                  onChangeText={(value) => updateField('phone', value)}
                  keyboardType="phone-pad"
                  icon="call-outline"
                  error={errors.phone}
                />

                <Input
                  label="House Number"
                  placeholder="Enter your house number"
                  value={formData.houseNumber}
                  onChangeText={(value) => updateField('houseNumber', value)}
                  icon="home-outline"
                  error={errors.houseNumber}
                />

                <Input
                  label="CNIC"
                  placeholder="XXXXX-XXXXXXX-X"
                  value={formData.cnic}
                  onChangeText={(value) => updateField('cnic', value)}
                  keyboardType="number-pad"
                  icon="card-outline"
                  error={errors.cnic}
                />

                <Input
                  label="Password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChangeText={(value) => updateField('password', value)}
                  isPassword
                  icon="lock-closed-outline"
                  error={errors.password}
                />

                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateField('confirmPassword', value)}
                  isPassword
                  icon="lock-closed-outline"
                  error={errors.confirmPassword}
                />

                <Button
                  title="Create Account"
                  onPress={handleSignup}
                  isLoading={isLoading}
                  fullWidth
                  style={styles.signupButton}
                />

                <View style={styles.signinContainer}>
                  <Text style={styles.signinText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.signinLink}>Sign In</Text>
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
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -80,
    right: -80,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -60,
    left: -60,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: '30%',
    left: '10%',
  },
  topContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    ...Typography.h2,
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
    marginBottom: Spacing.lg,
    fontWeight: '700',
  },
  signupButton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinText: {
    ...Typography.body1,
    color: Colors.text.secondary,
  },
  signinLink: {
    ...Typography.body1,
    color: Colors.primary[600],
    fontWeight: '700',
  },
});