// app/(tabs)/create-suggestion.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { useAuth } from '../../src/contexts/AuthContext';
import { checkActiveSuggestion, createSuggestion } from '../../src/services/complaint.service';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../src/theme';

export default function CreateSuggestionScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!user) return;

    setIsLoading(true);
    try {
      // Check if user already has an active suggestion
      const hasActiveSuggestion = await checkActiveSuggestion(user.uid);
      
      if (hasActiveSuggestion) {
        Alert.alert(
          'Active Suggestion Exists',
          'You already have a pending suggestion. Please wait for it to be reviewed before submitting a new one.'
        );
        setIsLoading(false);
        return;
      }

      await createSuggestion(
        user.uid,
        user.fullName,
        user.email,
        user.houseNumber,
        title,
        description
      );

      Alert.alert(
        'Success',
        'Your suggestion has been submitted successfully. You will be notified when the admin reviews it.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating suggestion:', error);
      Alert.alert('Error', 'Failed to submit suggestion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.text.inverse} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Submit Suggestion</Text>
            <View style={styles.backButton} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="bulb" size={32} color={Colors.info.dark} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Share Your Ideas</Text>
              <Text style={styles.infoText}>
                Help us improve our society! Share your suggestions for better facilities, services, or any improvements.
              </Text>
            </View>
          </Animated.View>

          {/* Title Input */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.section}>
            <Text style={styles.label}>Title *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Brief title for your suggestion"
                placeholderTextColor={Colors.text.tertiary}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>
            <Text style={styles.helperText}>{title.length}/100 characters</Text>
          </Animated.View>

          {/* Description Input */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.section}>
            <Text style={styles.label}>Description *</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your suggestion in detail. The more information you provide, the better we can understand and implement your idea."
                placeholderTextColor={Colors.text.tertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                maxLength={500}
              />
            </View>
            <Text style={styles.helperText}>{description.length}/500 characters</Text>
          </Animated.View>

          {/* Tips Card */}
          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Tips for a good suggestion:</Text>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>Be specific and clear</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>Explain the benefits</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>Suggest practical solutions</Text>
            </View>
          </Animated.View>

          {/* Submit Button */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <Button
              title="Submit Suggestion"
              onPress={handleSubmit}
              isLoading={isLoading}
              fullWidth
              style={styles.submitButton}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  headerGradient: {
    paddingBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.h4,
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary[100],
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    ...Typography.body1,
    fontWeight: '700',
    color: Colors.primary[700],
    marginBottom: Spacing.xs,
  },  
  infoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  infoText: {
    ...Typography.body2,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body1,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Shadows.small,
  },
  textAreaContainer: {
    paddingVertical: Spacing.md,
  },
  input: {
    ...Typography.body1,
    color: Colors.text.primary,
    padding: 0,
  },
  textArea: {
    minHeight: 150,
  },
  helperText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  tipsCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    ...Shadows.small,
  },
  tipsTitle: {
    ...Typography.body2,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary[500],
    marginRight: Spacing.sm,
  },
  tipText: {
    ...Typography.body2,
    color: Colors.text.secondary,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});