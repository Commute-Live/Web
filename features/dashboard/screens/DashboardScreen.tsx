import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PreviewCard} from '../../../components/PreviewCard';
import {BottomNav, BottomNavItem} from '../../../components/BottomNav';
import {colors, spacing, radii} from '../../../theme';
import {useSelectedDevice} from '../../../hooks/useSelectedDevice';

const navItems: BottomNavItem[] = [
  {key: 'stations', label: 'Stations', icon: 'train-outline', route: '/edit-stations'},
  {key: 'layout', label: 'Layout', icon: 'color-palette-outline', route: '/change-layout'},
  {key: 'bright', label: 'Bright', icon: 'sunny-outline', route: '/brightness'},
  {key: 'settings', label: 'Settings', icon: 'settings-outline', route: '/settings'},
];

export default function DashboardScreen() {
  const selectedDevice = useSelectedDevice();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.body}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <View style={styles.deviceHeaderCard}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.heading}>{selectedDevice.name}</Text>
                <Text style={styles.subheading}>Device ID: {selectedDevice.id}</Text>
              </View>
              <View style={styles.statusChip}>
                <View
                  style={[
                    styles.statusDot,
                    selectedDevice.status === 'Online'
                      ? styles.statusDotOnline
                      : styles.statusDotOffline,
                  ]}
                />
                <Text style={styles.statusText}>{selectedDevice.status}</Text>
              </View>
            </View>
          </View>

          <PreviewCard />
        </ScrollView>

        <BottomNav items={navItems} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  body: {flex: 1},
  scroll: {flex: 1},
  content: {padding: spacing.lg},
  deviceHeaderCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  headerRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  heading: {color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 1},
  subheading: {color: colors.textMuted, fontSize: 10},
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
  },
  statusDot: {width: 6, height: 6, borderRadius: 3},
  statusDotOnline: {backgroundColor: colors.success},
  statusDotOffline: {backgroundColor: colors.warning},
  statusText: {color: colors.text, fontSize: 10, fontWeight: '700'},
});
