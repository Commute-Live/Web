import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BottomNav, BottomNavItem} from '../../../components/BottomNav';
import {colors, spacing, radii} from '../../../theme';
import {useSelectedDevice} from '../../../hooks/useSelectedDevice';
import NycSubwayConfig from '../components/NycSubwayConfig';
import ChicagoSubwayConfig from '../components/ChicagoSubwayConfig';

const API_BASE = 'https://api.commutelive.com';

type ProviderOption = {id: 'mta-subway' | 'cta-subway'; label: string};

const providerOptions: ProviderOption[] = [
  {id: 'mta-subway', label: 'NYC Subway'},
  {id: 'cta-subway', label: 'Chicago Subway'},
];

const navItems: BottomNavItem[] = [
  {key: 'stations', label: 'Stations', icon: 'train-outline', route: '/edit-stations'},
  {key: 'layout', label: 'Layout', icon: 'color-palette-outline', route: '/change-layout'},
  {key: 'bright', label: 'Bright', icon: 'sunny-outline', route: '/brightness'},
  {key: 'settings', label: 'Settings', icon: 'settings-outline', route: '/settings'},
];

export default function DashboardScreen() {
  const selectedDevice = useSelectedDevice();
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption['id']>('mta-subway');

  useEffect(() => {
    let cancelled = false;
    const loadProviderFromConfig = async () => {
      try {
        const response = await fetch(`${API_BASE}/device/${selectedDevice.id}/config`);
        if (!response.ok) return;
        const data = await response.json();
        const firstProvider = typeof data?.config?.lines?.[0]?.provider === 'string' ? data.config.lines[0].provider : '';

        if (!cancelled && (firstProvider === 'mta-subway' || firstProvider === 'cta-subway')) {
          setSelectedProvider(firstProvider);
        }
      } catch {
        // Keep default provider.
      }
    };

    if (selectedDevice.id) {
      void loadProviderFromConfig();
    }

    return () => {
      cancelled = true;
    };
  }, [selectedDevice.id]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.body}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <View style={styles.deviceHeaderCard}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.heading}>Your Device</Text>
                <Text style={styles.subheading}>Device ID: {selectedDevice.id}</Text>
              </View>
              <View style={styles.statusChip}>
                <View
                  style={[
                    styles.statusDot,
                    selectedDevice.status === 'Online' ? styles.statusDotOnline : styles.statusDotOffline,
                  ]}
                />
                <Text style={styles.statusText}>{selectedDevice.status}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Pick Provider</Text>
            <View style={styles.providerRow}>
              {providerOptions.map(option => (
                <Pressable
                  key={option.id}
                  style={[styles.providerChip, selectedProvider === option.id && styles.providerChipActive]}
                  onPress={() => setSelectedProvider(option.id)}>
                  <Text
                    style={[styles.providerChipText, selectedProvider === option.id && styles.providerChipTextActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {selectedProvider === 'mta-subway' ? (
            <NycSubwayConfig deviceId={selectedDevice.id} />
          ) : (
            <ChicagoSubwayConfig deviceId={selectedDevice.id} />
          )}
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
  sectionCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: spacing.sm},
  providerRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs},
  providerChip: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
  },
  providerChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentMuted,
  },
  providerChipText: {color: colors.text, fontSize: 12, fontWeight: '700'},
  providerChipTextActive: {color: colors.accent},
});
