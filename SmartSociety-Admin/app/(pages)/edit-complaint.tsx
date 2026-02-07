// app/(tabs)/edit-complaint.tsx
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
import { Complaint, ComplaintCategories, ComplaintCategory } from '../../src/types/complaint.types';

interface CategoryCardProps {
  category: ComplaintCategory;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onSelect, index }) => {
  const info = ComplaintCategories[category];

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(600)}>
      <TouchableOpacity
        style={[
          styles.categoryCard,
          isSelected && styles.categoryCardSelected,
        ]}
        onPress={onSelect}
        activeOpacity={0.7}
      >
        <View style={[
          styles.categoryIconContainer,
          isSelected && styles.categoryIconContainerSelected,
        ]}>
          <Ionicons
            name={info.icon as any}
            size={28}
            color={isSelected ? Colors.text.inverse : Colors.primary[600]}
          />
        </View>
        <View style={styles.categoryContent}>
          <Text style={[
            styles.categoryLabel,
            isSelected && styles.categoryLabelSelected,
          ]}>
            {info.label}
          </Text>
          <Text style={[
            styles.categoryDescription,
            isSelected && styles.categoryDescriptionSelected,
          ]} numberOfLines={2}>
            {info.description}
          </Text>
        </View>
        {isSelected && (
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.primary[600]} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function EditComplaintScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    if (!id) return;
    
    try {
      const docRef = doc(db, 'complaints', id as string);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as Complaint;
        setSelectedCategory(data.category);
        setTitle(data.title);
        setDescription(data.description);
      } else {
        Alert.alert('Error', 'Complaint not found');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching complaint:', error);
      Alert.alert('Error', 'Failed to load complaint');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

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
      const docRef = doc(db, 'complaints', id as string);
      await updateDoc(docRef, {
        category: selectedCategory,
        title: title.trim(),
        description: description.trim(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert(
        'Success',
        'Your complaint has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating complaint:', error);
      Alert.alert('Error', 'Failed to update complaint. Please try again.');
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
            <Text style={styles.headerTitle}>Edit Complaint</Text>
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
          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <Text style={styles.sectionSubtitle}>Choose the type of complaint</Text>
            <View style={styles.categoriesContainer}>
              {(Object.keys(ComplaintCategories) as ComplaintCategory[]).map((category, index) => (
                <CategoryCard
                  key={category}
                  category={category}
                  isSelected={selectedCategory === category}
                  onSelect={() => setSelectedCategory(category)}
                  index={index}
                />
              ))}
            </View>
          </View>

          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Title *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Brief title for your complaint"
                placeholderTextColor={Colors.text.tertiary}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>
            <Text style={styles.helperText}>{title.length}/100 characters</Text>
          </View>

          {/* Description Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Description *</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your complaint in detail..."
                placeholderTextColor={Colors.text.tertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={500}
              />
            </View>
            <Text style={styles.helperText}>{description.length}/500 characters</Text>
          </View>

          {/* Submit Button */}
          <Button
            title="Update Complaint"
            onPress={handleSubmit}
            isLoading={isSubmitting}
            fullWidth
            style={styles.submitButton}
          />
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
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    ...Typography.body2,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  categoriesContainer: {
    gap: Spacing.md,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border.light,
    ...Shadows.small,
  },
  categoryCardSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  categoryIconContainerSelected: {
    backgroundColor: Colors.primary[500],
  },
  categoryContent: {
    flex: 1,
  },
  categoryLabel: {
    ...Typography.body1,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  categoryLabelSelected: {
    color: Colors.primary[700],
  },
  categoryDescription: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  categoryDescriptionSelected: {
    color: Colors.text.secondary,
  },
  checkIcon: {
    marginLeft: Spacing.sm,
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
    justifyContent: 'center',
    ...Shadows.small,
  },
  textAreaContainer: {
    paddingVertical: Spacing.md,
    minHeight: 120,
  },
  input: {
    ...Typography.body1,
    color: Colors.text.primary,
    padding: 0,
  },
  textArea: {
    minHeight: 100,
  },
  helperText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
});