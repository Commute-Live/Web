import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PreviewCard} from '../../../components/PreviewCard';
import {BottomNav, BottomNavItem} from '../../../components/BottomNav';
import {colors, spacing, radii} from '../../../theme';
import {useSelectedDevice} from '../../../hooks/useSelectedDevice';

const API_BASE = 'https://api.commutelive.com';
const NYC_LINES = ['1', '2', '3', '4', '5', '6', '7', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'J', 'L', 'M', 'N', 'Q', 'R', 'W', 'Z'];
const HARDCODED_STOP_ID = '725N';
const HARDCODED_DIRECTION: 'N' = 'N';
const HARDCODED_DESTINATION_LABEL = 'Times Sq-42 St (N)';

const navItems: BottomNavItem[] = [
  {key: 'stations', label: 'Stations', icon: 'train-outline', route: '/edit-stations'},
  {key: 'layout', label: 'Layout', icon: 'color-palette-outline', route: '/change-layout'},
  {key: 'bright', label: 'Bright', icon: 'sunny-outline', route: '/brightness'},
  {key: 'settings', label: 'Settings', icon: 'settings-outline', route: '/settings'},
];

export default function DashboardScreen() {
  const selectedDevice = useSelectedDevice();
  const [selectedLine, setSelectedLine] = useState('7');
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadConfig = async () => {
      try {
        const response = await fetch(`${API_BASE}/device/${selectedDevice.id}/config`);
        if (!response.ok) return;
        const data = await response.json();
        const firstLine = data?.config?.lines?.[0]?.line;
        if (!cancelled && typeof firstLine === 'string' && firstLine.length > 0) {
          setSelectedLine(firstLine.toUpperCase());
        }
      } catch {
        // Ignore network/read errors; keep default line.
      }
    };

    if (selectedDevice.id) {
      loadConfig();
    }

    return () => {
      cancelled = true;
    };
  }, [selectedDevice.id]);

  const saveLine = useCallback(
    async (line: string) => {
      if (!selectedDevice.id) return;
      setSelectedLine(line);
      setIsSaving(true);
      setStatusText('');
      try {
        const configResponse = await fetch(`${API_BASE}/device/${selectedDevice.id}/config`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            lines: [
              {
                provider: 'mta',
                line,
                stop: HARDCODED_STOP_ID,
                direction: HARDCODED_DIRECTION,
              },
            ],
          }),
        });
        if (!configResponse.ok) {
          setStatusText('Failed to save line');
          return;
        }

        await fetch(`${API_BASE}/refresh/device/${selectedDevice.id}`, {method: 'POST'});
        setStatusText(`Updated ${line} -> ${HARDCODED_DESTINATION_LABEL}`);
      } catch {
        setStatusText('Network error');
      } finally {
        setIsSaving(false);
      }
    },
    [selectedDevice.id],
  );

  const lineButtons = useMemo(
    () =>
      NYC_LINES.map(line => (
        <Pressable
          key={line}
          style={[styles.lineChip, selectedLine === line && styles.lineChipActive]}
          onPress={() => saveLine(line)}
          disabled={isSaving}>
          <Text style={[styles.lineChipText, selectedLine === line && styles.lineChipTextActive]}>
            {line}
          </Text>
        </Pressable>
      )),
    [selectedLine, saveLine, isSaving],
  );

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

          <View style={styles.linePickerCard}>
            <Text style={styles.linePickerTitle}>Pick Subway Line</Text>
            <Text style={styles.linePickerSubtitle}>Tap any line to send update to this device.</Text>
            <Text style={styles.destFixed}>Destination: {HARDCODED_DESTINATION_LABEL}</Text>

            <View style={styles.lineGrid}>{lineButtons}</View>
            {!!statusText && <Text style={styles.statusNote}>{statusText}</Text>}
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
  linePickerCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  linePickerTitle: {color: colors.text, fontSize: 14, fontWeight: '800'},
  linePickerSubtitle: {color: colors.textMuted, fontSize: 11, marginTop: 2, marginBottom: spacing.sm},
  destFixed: {color: colors.textMuted, fontSize: 12, marginBottom: spacing.sm},
  lineGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs},
  lineChip: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
  },
  lineChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentMuted,
  },
  lineChipText: {color: colors.text, fontSize: 12, fontWeight: '700'},
  lineChipTextActive: {color: colors.accent},
  statusNote: {color: colors.textMuted, fontSize: 11, marginTop: spacing.sm},
});
