// app/(tabs)/index.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { useAuth } from '../../src/contexts/AuthContext';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../src/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 3) / 2;

interface QuickActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  count?: number;
  gradient: readonly [string, string, ...string[]];
  onPress: () => void;
  index: number;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  count,
  gradient,
  onPress,
  index,
}) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(600)}
      style={styles.actionCard}
    >
      <TouchableOpacity
        style={styles.actionCardInner}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.actionGradient}
        >
          {/* Decorative circle */}
          <View style={styles.decorativeCircle} />
          
          <View style={styles.actionIconContainer}>
            <Ionicons name={icon} size={32} color={Colors.text.inverse} />
          </View>
          
          <Text style={styles.actionTitle}>{title}</Text>
          
          {count !== undefined && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{count}</Text>
            </View>
          )}

          <View style={styles.actionArrow}>
            <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.9)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, index }) => {
  return (
    <Animated.View
      entering={FadeInLeft.delay(index * 80).duration(600)}
      style={styles.statCard}
    >
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      {/* Subtle accent line */}
      <View style={[styles.statAccent, { backgroundColor: color }]} />
    </Animated.View>
  );
};

interface UpcomingEventProps {
  title: string;
  date: string;
  type: 'announcement' | 'event';
  color: string;
  index: number;
}

const UpcomingEvent: React.FC<UpcomingEventProps> = ({ title, date, type, color, index }) => {
  return (
    <Animated.View entering={FadeInRight.delay(index * 80).duration(600)}>
      <TouchableOpacity style={styles.eventCard} activeOpacity={0.7}>
        <LinearGradient
          colors={[color + '15', color + '08']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.eventGradient}
        >
          <View style={[styles.eventIndicator, { backgroundColor: color }]} />
          <View style={styles.eventContent}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle} numberOfLines={1}>{title}</Text>
              <View style={[styles.typeBadge, { backgroundColor: color + '25', borderColor: color }]}>
                <Text style={[styles.typeBadgeText, { color: color }]}>
                  {type === 'event' ? 'Event' : 'News'}
                </Text>
              </View>
            </View>
            <View style={styles.eventDateContainer}>
              <Ionicons name="calendar-outline" size={14} color={Colors.text.tertiary} />
              <Text style={styles.eventDate}>{date}</Text>
            </View>
          </View>
          <View style={[styles.eventIconContainer, { backgroundColor: color + '20' }]}>
            <Ionicons 
              name={type === 'event' ? 'calendar' : 'megaphone'} 
              size={18} 
              color={color} 
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const quickActions = [
    { 
      icon: 'megaphone' as const, 
      title: 'Events', 
      count: 3, 
      gradient: ['#10B981', '#059669'] as const,
      onPress: () => {} 
    },
    { 
      icon: 'chatbox-ellipses' as const, 
      title: 'Complaints', 
      gradient: ['#F59E0B', '#D97706'] as const,
      onPress: () => {} 
    },
    { 
      icon: 'card' as const, 
      title: 'Pay Bills', 
      count: 2, 
      gradient: ['#3B82F6', '#2563EB'] as const,
      onPress: () => {} 
    },
    { 
      icon: 'chatbubbles' as const, 
      title: 'Chatbot', 
      gradient: ['#8B5CF6', '#7C3AED'] as const,
      onPress: () => {} 
    },
  ];

  const stats = [
    { label: 'Pending Bills', value: '2', icon: 'document-text' as const, color: '#F59E0B' },
    { label: 'Open Issues', value: '1', icon: 'alert-circle' as const, color: '#EF4444' },
    { label: 'New Updates', value: '5', icon: 'notifications' as const, color: '#10B981' },
  ];

  const upcomingEvents = [
    { title: 'Community Meeting - Monthly Discussion', date: 'Oct 25, 2025', type: 'event' as const, color: '#3B82F6' },
    { title: 'Water Supply Maintenance Notice', date: 'Oct 28, 2025', type: 'announcement' as const, color: '#10B981' },
    { title: 'Security System Upgrade', date: 'Nov 01, 2025', type: 'event' as const, color: '#8B5CF6' },
  ];

  return (
    <View style={styles.container}>
      {/* Enhanced Header with Mesh Gradient */}
      <LinearGradient
        colors={['#10B981', '#059669', '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        {/* Decorative elements */}
        <View style={styles.headerCircle1} />
        <View style={styles.headerCircle2} />
        
        <SafeAreaView edges={['top']}>
          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#F0FDF4']}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {user?.fullName?.charAt(0).toUpperCase() || 'R'}
                  </Text>
                </LinearGradient>
                {/* Online indicator */}
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.greeting}>Good Evening 👋</Text>
                <Text style={styles.userName}>{user?.fullName?.split(' ')[0] || 'Resident'}</Text>
                <View style={styles.houseInfo}>
                  <Ionicons name="home" size={12} color="rgba(255, 255, 255, 0.9)" />
                  <Text style={styles.houseText}>House #{user?.houseNumber}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                style={styles.notificationGradient}
              >
                <View style={styles.notificationDot} />
                <Ionicons name="notifications" size={24} color={Colors.text.inverse} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

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
        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Animated.Text 
            entering={FadeInUp.delay(200).duration(600)} 
            style={styles.sectionTitle}
          >
            Quick Overview
          </Animated.Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} index={index} />
            ))}
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.actionsSection}>
          <Animated.Text 
            entering={FadeInUp.delay(300).duration(600)} 
            style={styles.sectionTitle}
          >
            Quick Actions
          </Animated.Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} index={index} />
            ))}
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.eventsSection}>
          <Animated.View 
            entering={FadeInUp.delay(400).duration(600)} 
            style={styles.sectionHeader}
          >
            <View>
              <Text style={styles.sectionTitle}>Recent Updates</Text>
              <Text style={styles.sectionSubtitle}>Stay informed about society activities</Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAll}>View All</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.primary[600]} />
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.eventsContainer}>
            {upcomingEvents.map((event, index) => (
              <UpcomingEvent key={index} {...event} index={index} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  headerGradient: {
    paddingBottom: Spacing.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  headerCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  headerCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -30,
    left: -40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    zIndex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: Spacing.md,
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarText: {
    ...Typography.h3,
    color: Colors.primary[600],
    fontWeight: '800',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 3,
    borderColor: '#10B981',
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    ...Typography.body2,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 2,
  },
  userName: {
    ...Typography.h4,
    color: Colors.text.inverse,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  houseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  houseText: {
    ...Typography.caption,
    color: Colors.text.inverse,
    fontWeight: '700',
    marginLeft: 4,
  },
  notificationButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  notificationGradient: {
    padding: Spacing.sm + 2,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#10B981',
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  statsSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  sectionSubtitle: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  statsGrid: {
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.medium,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    ...Typography.h3,
    color: Colors.text.primary,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    fontSize: 11,
  },
  statAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  actionsSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionCard: {
    width: CARD_WIDTH,
  },
  actionCardInner: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.large,
  },
  actionGradient: {
    padding: Spacing.lg,
    minHeight: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -30,
    right: -30,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  actionTitle: {
    ...Typography.body1,
    fontWeight: '700',
    color: Colors.text.inverse,
    marginBottom: Spacing.xs,
  },
  countBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.full,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  countText: {
    ...Typography.caption,
    color: Colors.text.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  actionArrow: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventsSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  seeAll: {
    ...Typography.caption,
    color: Colors.primary[600],
    fontWeight: '700',
    marginRight: 4,
  },
  eventsContainer: {
    gap: Spacing.sm,
  },
  eventCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.small,
  },
  eventGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.primary,
  },
  eventIndicator: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  eventTitle: {
    ...Typography.body2,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  typeBadgeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  eventDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginLeft: 4,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
});