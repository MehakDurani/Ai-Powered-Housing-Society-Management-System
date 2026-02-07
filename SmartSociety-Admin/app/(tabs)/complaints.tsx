// app/(tabs)/complaints.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '../../src/contexts/AuthContext';
import { getUserComplaints, getUserSuggestions, deleteComplaint, deleteSuggestion } from '../../src/services/complaint.service';
import { Complaint, Suggestion, ComplaintCategories } from '../../src/types/complaint.types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../src/theme';

type TabType = 'complaints' | 'suggestions';

interface ComplaintCardProps {
  complaint: Complaint;
  onPress: () => void;
  onDelete: () => void;
  index: number;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onPress, onDelete, index }) => {
  const categoryInfo = ComplaintCategories[complaint.category];
  const statusConfig = {
    pending: { 
      gradient: ['#FEF3C7', '#FDE68A'], 
      color: '#F59E0B',
      icon: 'time' as const,
      label: 'Pending'
    },
    in_progress: { 
      gradient: ['#DBEAFE', '#BFDBFE'], 
      color: '#3B82F6',
      icon: 'sync' as const,
      label: 'In Progress'
    },
    resolved: { 
      gradient: ['#D1FAE5', '#A7F3D0'], 
      color: '#10B981',
      icon: 'checkmark-circle' as const,
      label: 'Resolved'
    },
  };
  const status = statusConfig[complaint.status];

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(600)}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          {/* Decorative element */}
          <View style={[styles.cardAccent, { backgroundColor: status.color }]} />
          
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={[status.color + '25', status.color + '15']}
              style={styles.iconContainer}
            >
              <Ionicons name={categoryInfo.icon as any} size={24} color={status.color} />
            </LinearGradient>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardCategory}>{categoryInfo.label}</Text>
              <View style={[styles.statusBadge, { backgroundColor: status.gradient[0], borderColor: status.color }]}>
                <Ionicons name={status.icon} size={12} color={status.color} />
                <Text style={[styles.statusText, { color: status.color }]}>
                  {status.label}
                </Text>
              </View>
            </View>
            {complaint.status === 'pending' && (
              <TouchableOpacity
                onPress={onDelete}
                style={styles.deleteButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <LinearGradient
                  colors={['#FEE2E2', '#FECACA']}
                  style={styles.deleteGradient}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>{complaint.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>{complaint.description}</Text>

          <View style={styles.cardFooter}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={14} color={Colors.text.tertiary} />
              <Text style={styles.dateText}>
                {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
            {complaint.adminReply && (
              <View style={styles.replyIndicator}>
                <View style={styles.replyDot} />
                <Text style={styles.replyText}>Admin Replied</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface SuggestionCardProps {
  suggestion: Suggestion;
  onPress: () => void;
  onDelete: () => void;
  index: number;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onPress, onDelete, index }) => {
  const statusConfigs = {
    pending: { gradient: ['#FEF3C7', '#FDE68A'], color: '#F59E0B', icon: 'time' as const, label: 'Pending' },
    in_progress: { gradient: ['#DBEAFE', '#BFDBFE'], color: '#3B82F6', icon: 'sync' as const, label: 'In Progress' },
    reviewed: { gradient: ['#D1FAE5', '#A7F3D0'], color: '#10B981', icon: 'checkmark-done' as const, label: 'Reviewed' }
  } as const;
  
  const statusConfig = statusConfigs[suggestion.status] || statusConfigs.pending;
  const isReviewed = suggestion.status === 'reviewed';

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(600)}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={[styles.cardAccent, { backgroundColor: statusConfig.color }]} />
          
          <View style={styles.cardHeader}>
            <LinearGradient
                        colors={['#10B981', '#059669']}

              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <Ionicons name="bulb" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardCategory}>Suggestion</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.gradient[0], borderColor: statusConfig.color }]}>
                <Ionicons name={statusConfig.icon} size={12} color={statusConfig.color} />
                <Text style={[styles.statusText, { color: statusConfig.color }]}>
                  {statusConfig.label}
                </Text>
              </View>
            </View>
            {!isReviewed && (
              <TouchableOpacity
                onPress={onDelete}
                style={styles.deleteButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <LinearGradient
                  colors={['#FEE2E2', '#FECACA']}
                  style={styles.deleteGradient}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>{suggestion.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>{suggestion.description}</Text>

          <View style={styles.cardFooter}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={14} color={Colors.text.tertiary} />
              <Text style={styles.dateText}>
                {new Date(suggestion.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
            {suggestion.adminReply && (
              <View style={styles.replyIndicator}>
                <View style={styles.replyDot} />
                <Text style={styles.replyText}>Admin Replied</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ComplaintsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('complaints');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      const [complaintsData, suggestionsData] = await Promise.all([
        getUserComplaints(user.uid),
        getUserSuggestions(user.uid),
      ]);
      setComplaints(complaintsData);
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDeleteComplaint = (complaintId: string) => {
    Alert.alert(
      'Delete Complaint',
      'Are you sure you want to delete this complaint?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteComplaint(complaintId);
              setComplaints(complaints.filter(c => c.id !== complaintId));
              Alert.alert('Success', 'Complaint deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete complaint');
            }
          },
        },
      ]
    );
  };

  const handleDeleteSuggestion = (suggestionId: string) => {
    Alert.alert(
      'Delete Suggestion',
      'Are you sure you want to delete this suggestion?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSuggestion(suggestionId);
              setSuggestions(suggestions.filter(s => s.id !== suggestionId));
              Alert.alert('Success', 'Suggestion deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete suggestion');
            }
          },
        },
      ]
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={['#F0F9FF', '#E0F2FE']}
        style={styles.emptyGradient}
      >
        <Ionicons
          name={activeTab === 'complaints' ? 'document-text-outline' : 'bulb-outline'}
          size={80}
          color="#3B82F6"
        />
      </LinearGradient>
      <Text style={styles.emptyTitle}>
        No {activeTab === 'complaints' ? 'Complaints' : 'Suggestions'} Yet
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'complaints'
          ? 'Tap the + button to lodge a complaint'
          : 'Tap the + button to submit a suggestion'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#059669', '#047857', '#065F46']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        {/* Decorative circles */}
        <View style={styles.headerCircle1} />
        <View style={styles.headerCircle2} />
        
        <SafeAreaView edges={['top']}>
          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Complaints & Suggestions</Text>
              <Text style={styles.headerSubtitle}>Manage your submissions</Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      {/* Enhanced Tabs */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.tabsContainer}>
        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={styles.tabsGradient}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === 'complaints' && styles.tabActive]}
            onPress={() => setActiveTab('complaints')}
          >
            {activeTab === 'complaints' && (
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Ionicons 
              name="chatbox-ellipses" 
              size={18} 
              color={activeTab === 'complaints' ? '#FFFFFF' : Colors.text.secondary} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, activeTab === 'complaints' && styles.tabTextActive]}>
              Complaints ({complaints.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'suggestions' && styles.tabActive]}
            onPress={() => setActiveTab('suggestions')}
          >
            {activeTab === 'suggestions' && (
              <LinearGradient
                          colors={['#10B981', '#059669']}

                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Ionicons 
              name="bulb" 
              size={18} 
              color={activeTab === 'suggestions' ? '#FFFFFF' : Colors.text.secondary} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, activeTab === 'suggestions' && styles.tabTextActive]}>
              Suggestions ({suggestions.length})
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary[500]}
            colors={[Colors.primary[500]]}
          />
        }
      >
        {activeTab === 'complaints' ? (
          complaints.length > 0 ? (
            complaints.map((complaint, index) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onPress={() => router.push({
                  pathname: '/complaint-detail',
                  params: { id: complaint.id, type: 'complaint' }
                } as any)}
                onDelete={() => handleDeleteComplaint(complaint.id)}
                index={index}
              />
            ))
          ) : (
            renderEmpty()
          )
        ) : (
          suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onPress={() => router.push({
                  pathname: '/complaint-detail',
                  params: { id: suggestion.id, type: 'suggestion' }
                } as any)}
                onDelete={() => handleDeleteSuggestion(suggestion.id)}
                index={index}
              />
            ))
          ) : (
            renderEmpty()
          )
        )}
      </ScrollView>

      {/* Enhanced FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          if (activeTab === 'complaints') {
            router.push('/create-complaint');
          } else {
            router.push('/create-suggestion');
          }
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={ ['#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={32} color={Colors.text.inverse} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  headerGradient: {
    paddingBottom: Spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  headerCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -60,
    right: -40,
  },
  headerCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -20,
    left: -30,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    zIndex: 1,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text.inverse,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    ...Typography.body2,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  tabsContainer: {
    marginHorizontal: Spacing.xl,
    marginTop: -Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.large,
  },
  tabsGradient: {
    flexDirection: 'row',
    padding: Spacing.xs,
    gap: Spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  tabActive: {
    // Gradient applied via LinearGradient component
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    ...Typography.body2,
    fontWeight: '700',
    color: Colors.text.secondary,
  },
  tabTextActive: {
    color: Colors.text.inverse,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 100,
  },
  card: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  cardGradient: {
    padding: Spacing.md,
    position: 'relative',
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  cardCategory: {
    ...Typography.body2,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 11,
    marginLeft: 4,
  },
  deleteButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  deleteGradient: {
    padding: Spacing.sm,
  },
  cardTitle: {
    ...Typography.body1,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    lineHeight: 22,
  },
  cardDescription: {
    ...Typography.body2,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginLeft: 4,
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  replyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary[500],
    marginRight: 4,
  },
  replyText: {
    ...Typography.caption,
    color: Colors.primary[700],
    fontWeight: '700',
    fontSize: 11,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
  },
  emptyGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  emptyTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    fontWeight: '700',
  },
  emptySubtitle: {
    ...Typography.body2,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    borderRadius: 32,
    ...Shadows.large,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});