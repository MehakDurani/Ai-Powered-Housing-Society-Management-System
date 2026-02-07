// app/(tabs)/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../src/config/firebase';
import { useAuth } from '../../src/contexts/AuthContext';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../src/theme';

interface ProfileItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  index: number;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, label, value, index }) => {
  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(600)}>
      <View style={styles.profileItem}>
        <View style={styles.itemIcon}>
          <Ionicons name={icon} size={20} color={Colors.primary[600]} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemLabel}>{label}</Text>
          <Text style={styles.itemValue}>{value}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  index: number;
  danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  index,
  danger = false,
}) => {
  return (
    <Animated.View entering={FadeInDown.delay(300 + index * 50).duration(600)}>
      <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
          <Ionicons
            name={icon}
            size={22}
            color={danger ? Colors.error.main : Colors.primary[600]}
          />
        </View>
        <View style={styles.menuContent}>
          <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.neutral[400]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const profileItems = [
    { icon: 'mail' as const, label: 'Email', value: user?.email || 'N/A' },
    { icon: 'call' as const, label: 'Phone', value: user?.phone || 'N/A' },
    { icon: 'home' as const, label: 'House Number', value: user?.houseNumber || 'N/A' },
    { icon: 'card' as const, label: 'CNIC', value: user?.cnic || 'N/A' },
  ];

  const menuItems = [
    {
      icon: 'person-outline' as const,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon!'),
    },
    {
      icon: 'notifications-outline' as const,
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon!'),
    },
    {
      icon: 'lock-closed-outline' as const,
      title: 'Change Password',
      subtitle: 'Update your account password',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon!'),
    },
    {
      icon: 'help-circle-outline' as const,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Coming Soon', 'This feature will be available soon!'),
    },
    {
      icon: 'information-circle-outline' as const,
      title: 'About',
      subtitle: 'App version and information',
      onPress: () => Alert.alert('Smart Society', 'Version 1.0.0'),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <LinearGradient
            colors={[Colors.primary[400], Colors.primary[600]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0).toUpperCase() || 'R'}
            </Text>
          </LinearGradient>
          <Text style={styles.userName}>{user?.fullName || 'Resident'}</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active Member</Text>
          </View>
        </Animated.View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            {profileItems.map((item, index) => (
              <ProfileItem key={index} {...item} index={index} />
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            {menuItems.map((item, index) => (
              <MenuItem key={index} {...item} index={index} />
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={Colors.error.main} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* App Version */}
        <Text style={styles.versionText}>Smart Society v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.background.primary,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.large,
  },
  avatarText: {
    ...Typography.h1,
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  userName: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success.light + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success.main,
    marginRight: Spacing.xs,
  },
  statusText: {
    ...Typography.body2,
    color: Colors.success.dark,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    ...Shadows.small,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  itemValue: {
    ...Typography.body1,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuIconDanger: {
    backgroundColor: Colors.error.light + '20',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    ...Typography.body1,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  menuTitleDanger: {
    color: Colors.error.main,
  },
  menuSubtitle: {
    ...Typography.body2,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.error.main,
    ...Shadows.small,
  },
  logoutText: {
    ...Typography.button,
    color: Colors.error.main,
    marginLeft: Spacing.sm,
  },
  versionText: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});