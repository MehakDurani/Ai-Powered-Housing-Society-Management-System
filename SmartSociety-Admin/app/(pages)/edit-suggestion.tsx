// app/(tabs)/edit-suggestion.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { db } from '../../src/config/firebase';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../src/theme';
import { Suggestion } from '../../src/types/complaint.types';

export default function EditSuggestionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSuggestion();
  }, [id]);

  const fetchSuggestion = async () => {
    if (!id) return;
    
    try {
      const docRef = doc(db, 'suggestions', id as string);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as Suggestion;
        setTitle(data.title);
        setDescription(data.description);
      } else {
        Alert.alert('Error', 'Suggestion not found');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      Alert.alert('Error', 'Failed to load suggestion');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    setIsSubmitting(true);
    try {
      const docRef = doc(db, 'suggestions', id as string);
      await updateDoc(docRef, {
        title: title.trim(),
        description: description.trim(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert(
        'Success',
        'Your suggestion has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating suggestion:', error);
      Alert.alert('Error', 'Failed to update suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary[500]} />
      </View>
    );
  }

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
            <Text style={styles.headerTitle}>Edit Suggestion</Text>
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
              <Ionicons name="bulb" size={32} color={Colors.primary[600]} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Update Your Idea</Text>
              <Text style={styles.infoText}>
                Make changes to your suggestion to better express your ideas for improving our society.
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
                placeholder="Describe your suggestion in detail..."
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

          {/* Submit Button */}
          <Animated.View entering={FadeInDown.delay(300).duration(600)}>
            <Button
              title="Update Suggestion"
              onPress={handleSubmit}
              isLoading={isSubmitting}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  infoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
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
    justifyContent:'center',
    
    ...Shadows.small,
  },
  textAreaContainer: {
    paddingVertical: Spacing.md,
    minHeight: 150,
  },
  input: {
    ...Typography.body1,
    color: Colors.text.primary,
    padding: 0,
  },
  textArea: {
    minHeight: 130,
  },
  helperText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});