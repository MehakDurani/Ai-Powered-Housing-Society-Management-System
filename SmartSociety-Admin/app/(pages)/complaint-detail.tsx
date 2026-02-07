// app/(tabs)/complaint-detail.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { db } from '../../src/config/firebase';
import { Complaint, Suggestion, ComplaintCategories } from '../../src/types/complaint.types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../src/theme';

export default function ComplaintDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, type } = params; // id and type (complaint/suggestion)
  
  const [data, setData] = useState<Complaint | Suggestion | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isComplaint = type === 'complaint';

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    
    try {
      const collectionName = isComplaint ? 'complaints' : 'suggestions';
      const docRef = doc(db, collectionName, id as string);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const docData = docSnap.data();
        setData({
          id: docSnap.id,
          ...docData,
          createdAt: docData.createdAt?.toDate(),
          updatedAt: docData.updatedAt?.toDate(),
          repliedAt: docData.repliedAt?.toDate(),
          resolvedAt: docData.resolvedAt?.toDate(),
          reviewedAt: docData.reviewedAt?.toDate(),
        } as any);
      } else {
        Alert.alert('Error', 'Item not found');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!data) return;
    
    if (data.status !== 'pending') {
      Alert.alert(
        'Cannot Edit',
        `You can only edit ${isComplaint ? 'complaints' : 'suggestions'} that are pending.`
      );
      return;
    }

    if (isComplaint) {
      router.push({
        pathname: '/edit-complaint',
        params: { id: data.id }
      } as any);
    } else {
      router.push({
        pathname: '/edit-suggestion',
        params: { id: data.id }
      } as any);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary[500]} />
      </View>
    );
  }

  if (!data) {
    return null;
  }

  // Normalize status to ensure consistent format
  const status = data.status
  const statusColors = {
    pending: { bg: Colors.warning.main + '20', text: Colors.warning.dark, border: Colors.warning.main },
    in_progress: { bg: Colors.info.main + '20', text: Colors.info.dark, border: Colors.info.main },
    resolved: { bg: Colors.success.main + '20', text: Colors.success.dark, border: Colors.success.main },
    reviewed: { bg: Colors.success.main + '20', text: Colors.success.dark, border: Colors.success.main },
  };
  
  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.pending;
  const categoryInfo = isComplaint ? ComplaintCategories[(data as Complaint).category] : null;

  const statusGradients: Record<string, readonly [string, string]> = {
    pending: ['#FEF3C7', '#FDE68A'] as const,
    in_progress: ['#DBEAFE', '#BFDBFE'] as const,
    resolved: ['#D1FAE5', '#A7F3D0'] as const,
    reviewed: ['#D1FAE5', '#A7F3D0'] as const,
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return '';
    return `${formatDate(date)} at ${formatTime(date)}`;
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#059669', '#047857', '#065F46']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        {/* Decorative elements */}
        <View style={styles.headerCircle} />
        
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                style={styles.backGradient}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.text.inverse} />
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>
                {isComplaint ? 'Complaint Details' : 'Suggestion Details'}
              </Text>
              <Text style={styles.headerSubtitle}>View complete information</Text>
            </View>
            {data.status === 'pending' && (
              <TouchableOpacity
                onPress={handleEdit}
                style={styles.editButton}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                  style={styles.editGradient}
                >
                  <Ionicons name="create-outline" size={24} color={Colors.text.inverse} />
                </LinearGradient>
              </TouchableOpacity>
            )}
            {data.status !== 'pending' && <View style={styles.backButton} />}
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Status Card */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.statusCard}>
          <LinearGradient
            colors={statusGradients[status as keyof typeof statusGradients]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statusGradient}
          >
            <Ionicons 
              name={status === 'resolved' || status === 'reviewed' ? 'checkmark-circle' : status === 'in_progress' ? 'sync' : 'time'} 
              size={24} 
              color={statusColor.border} 
            />
            <Text style={[styles.statusTextLarge, { color: statusColor.text }]}>
              {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Enhanced Main Content */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.card}>
          <LinearGradient
            colors={['#FFFFFF', '#F9FAFB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            {isComplaint && categoryInfo && (
              <View style={styles.categorySection}>
                <LinearGradient
                  colors={[statusColor.border + '25', statusColor.border + '15']}
                  style={styles.categoryIconContainer}
                >
                  <Ionicons name={categoryInfo.icon as any} size={28} color={statusColor.border} />
                </LinearGradient>
                <View>
                  <Text style={styles.categoryLabel}>Category</Text>
                  <Text style={styles.categoryValue}>{categoryInfo.label}</Text>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.labelContainer}>
                <View style={[styles.labelDot, { backgroundColor: Colors.primary[500] }]} />
                <Text style={styles.sectionLabel}>Title</Text>
              </View>
              <Text style={styles.titleText}>{data.title}</Text>
            </View>

            <View style={styles.section}>
              <View style={styles.labelContainer}>
                <View style={[styles.labelDot, { backgroundColor: Colors.primary[500] }]} />
                <Text style={styles.sectionLabel}>Description</Text>
              </View>
              <Text style={styles.descriptionText}>{data.description}</Text>
            </View>

            <View style={styles.metaSection}>
              <View style={styles.metaItem}>
                <LinearGradient
                  colors={['#E0F2FE', '#BAE6FD']}
                  style={styles.metaIcon}
                >
                  <Ionicons name="calendar-outline" size={14} color="#0284C7" />
                </LinearGradient>
                <Text style={styles.metaText}>Submitted on {formatDate(data.createdAt)}</Text>
              </View>
              <View style={styles.metaItem}>
                <LinearGradient
                  colors={['#FEE2E2', '#FECACA']}
                  style={styles.metaIcon}
                >
                  <Ionicons name="time-outline" size={14} color="#DC2626" />
                </LinearGradient>
                <Text style={styles.metaText}>{formatTime(data.createdAt)}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Enhanced Admin Reply */}
        {data.adminReply && (
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.replyCard}>
            <LinearGradient
              colors={['#ECFDF5', '#D1FAE5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.replyGradient}
            >
              <View style={styles.replyHeader}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.replyIconContainer}
                >
                  <Ionicons name="chatbox-ellipses" size={20} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.replyTitle}>Admin Response</Text>
              </View>
              <Text style={styles.replyText}>{data.adminReply}</Text>
              {data.repliedAt && (
                <View style={styles.replyMeta}>
                  <Ionicons name="checkmark-circle" size={14} color="#059669" />
                  <Text style={styles.replyMetaText}>Replied on {formatDateTime(data.repliedAt)}</Text>
                </View>
              )}
            </LinearGradient>
          </Animated.View>
        )}

        {/* Enhanced Timeline */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.timelineCard}>
          <LinearGradient
            colors={['#FFFFFF', '#F9FAFB']}
            style={styles.timelineGradient}
          >
            <View style={styles.timelineTitleContainer}>
              <Ionicons name="time-outline" size={24} color={Colors.primary[600]} />
              <Text style={styles.timelineTitle}>Activity Timeline</Text>
            </View>
            
            <View style={styles.timelineItem}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.timelineDotGradient}
              />
              {data.status !== 'pending' && <View style={styles.timelineLine} />}
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Submitted</Text>
                <Text style={styles.timelineDate}>{formatDateTime(data.createdAt)}</Text>
              </View>
            </View>

            {data.status === 'in_progress' && (
              <View style={styles.timelineItem}>
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={styles.timelineDotGradient}
                />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>In Progress</Text>
                  <Text style={styles.timelineDate}>{formatDateTime(data.updatedAt)}</Text>
                </View>
              </View>
            )}

            {(data.status === 'resolved' || data.status === 'reviewed') && (
              <>
                {data.repliedAt && (
                  <View style={styles.timelineItem}>
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      style={styles.timelineDotGradient}
                    />
                    <View style={styles.timelineLine} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineLabel}>Admin Replied</Text>
                      <Text style={styles.timelineDate}>{formatDateTime(data.repliedAt)}</Text>
                    </View>
                  </View>
                )}
                
                <View style={styles.timelineItem}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.timelineDotGradient}
                  />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineLabel}>
                      {isComplaint ? 'Resolved' : 'Reviewed'}
                    </Text>
                    <Text style={styles.timelineDate}>
                      {formatDateTime((data as any).resolvedAt || (data as any).reviewedAt)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFB',
  },
  headerGradient: {
    paddingBottom: Spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  headerCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -80,
    right: -60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    zIndex: 1,
  },
  backButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  backGradient: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  editButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  editGradient: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.h4,
    color: Colors.text.inverse,
    fontWeight: '800',
  },
  headerSubtitle: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  statusCard: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statusGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    ...Shadows.medium,
  },
  statusTextLarge: {
    ...Typography.body1,
    fontWeight: '800',
  },
  card: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  cardGradient: {
    padding: Spacing.lg,
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  categoryLabel: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginBottom: 2,
  },
  categoryValue: {
    ...Typography.body1,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  labelDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: Spacing.xs,
  },
  sectionLabel: {
    ...Typography.body2,
    fontWeight: '700',
    color: Colors.text.secondary,
  },
  titleText: {
    ...Typography.h4,
    color: Colors.text.primary,
    fontWeight: '800',
    lineHeight: 28,
  },
  descriptionText: {
    ...Typography.body1,
    color: Colors.text.secondary,
    lineHeight: 26,
  },
  metaSection: {
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  replyCard: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  replyGradient: {
    padding: Spacing.lg,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  replyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  replyTitle: {
    ...Typography.body1,
    fontWeight: '800',
    color: '#047857',
  },
  replyText: {
    ...Typography.body1,
    color: Colors.text.secondary,
    lineHeight: 26,
    marginBottom: Spacing.md,
  },
  replyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyMetaText: {
    ...Typography.caption,
    color: '#047857',
    marginLeft: Spacing.xs,
    fontWeight: '600',
  },
  timelineCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  timelineGradient: {
    padding: Spacing.lg,
  },
  timelineTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  timelineTitle: {
    ...Typography.h4,
    fontWeight: '800',
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  timelineDotGradient: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 4,
    marginRight: Spacing.md,
  },
  timelineLine: {
    position: 'absolute',
    left: 7,
    top: 20,
    bottom: -Spacing.lg,
    width: 2,
    backgroundColor: Colors.border.light,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    ...Typography.body1,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  timelineDate: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
});