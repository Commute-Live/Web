import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {colors, radii, spacing} from '../../../theme';

const API_BASE = 'https://api.commutelive.com';
const CTA_DEFAULT_STOP_ID = '40380';
const CTA_DEFAULT_STOP_NAME = 'Clark/Lake';
const MAX_SELECTED_LINES = 2;

type StopOption = {stopId: string; stop: string; direction: ''};

type Props = {
  deviceId: string;
};

const CTA_STOPS: StopOption[] = [
  {stopId: '40380', stop: 'Clark/Lake', direction: ''},
  {stopId: '41400', stop: 'Roosevelt', direction: ''},
  {stopId: '40900', stop: 'Howard', direction: ''},
  {stopId: '40890', stop: "O'Hare", direction: ''},
  {stopId: '40450', stop: '95th/Dan Ryan', direction: ''},
];

const CTA_LINES_BY_STOP: Record<string, string[]> = {
  '40380': ['RED', 'BLUE', 'BRN', 'G', 'ORG', 'P', 'PINK'],
  '41400': ['RED', 'G', 'ORG'],
  '40900': ['RED', 'P', 'Y'],
  '40890': ['BLUE'],
  '40450': ['RED'],
};

const getCtaLinesForStop = (stopId: string) => CTA_LINES_BY_STOP[stopId] ?? ['RED', 'BLUE'];

export default function ChicagoSubwayConfig({deviceId}: Props) {
  const [selectedLines, setSelectedLines] = useState<string[]>(['BLUE']);
  const [stopId, setStopId] = useState(CTA_DEFAULT_STOP_ID);
  const [stopName, setStopName] = useState(CTA_DEFAULT_STOP_NAME);
  const [availableLines, setAvailableLines] = useState<string[]>(getCtaLinesForStop(CTA_DEFAULT_STOP_ID));
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadConfig = async () => {
      try {
        const response = await fetch(`${API_BASE}/device/${deviceId}/config`);
        if (!response.ok) return;
        const data = await response.json();
        const firstProvider = typeof data?.config?.lines?.[0]?.provider === 'string' ? data.config.lines[0].provider : '';
        if (firstProvider !== 'cta-subway') return;

        const configuredLines = Array.isArray(data?.config?.lines)
          ? data.config.lines
              .map((line: any) => (typeof line?.line === 'string' ? line.line.toUpperCase() : ''))
              .filter((line: string) => line.length > 0)
          : [];
        const firstStopId = typeof data?.config?.lines?.[0]?.stop === 'string' ? data.config.lines[0].stop.toUpperCase() : '';

        if (!cancelled && firstStopId.length > 0) {
          setStopId(firstStopId);
          const foundStop = CTA_STOPS.find(s => s.stopId === firstStopId);
          setStopName(foundStop?.stop ?? firstStopId);
          const stopLines = getCtaLinesForStop(firstStopId);
          setAvailableLines(stopLines);
          if (configuredLines.length > 0) {
            const filtered = configuredLines.filter((line: string) => stopLines.includes(line));
            setSelectedLines((filtered.length > 0 ? filtered : stopLines).slice(0, MAX_SELECTED_LINES));
          }
          return;
        }

        if (!cancelled && configuredLines.length > 0) {
          setSelectedLines(configuredLines.slice(0, MAX_SELECTED_LINES));
        }
      } catch {
        // Keep defaults.
      }
    };

    if (deviceId) {
      void loadConfig();
    }

    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  const chooseStop = useCallback((option: StopOption) => {
    setStopId(option.stopId);
    setStopName(option.stop);
    setStatusText('');

    const stopLines = getCtaLinesForStop(option.stopId);
    setAvailableLines(stopLines);
    setSelectedLines(prev => {
      const filtered = prev.filter(line => stopLines.includes(line));
      if (filtered.length > 0) return filtered.slice(0, MAX_SELECTED_LINES);
      return stopLines.slice(0, MAX_SELECTED_LINES);
    });
  }, []);

  const toggleLine = useCallback((line: string) => {
    setStatusText('');
    setSelectedLines(prev => {
      if (prev.includes(line)) {
        return prev.filter(item => item !== line);
      }
      if (prev.length >= MAX_SELECTED_LINES) {
        return [...prev.slice(1), line];
      }
      return [...prev, line];
    });
  }, []);

  const saveConfig = useCallback(async () => {
    if (!deviceId) return;
    setIsSaving(true);
    setStatusText('');

    if (selectedLines.length === 0) {
      setStatusText('Select at least one line');
      setIsSaving(false);
      return;
    }

    try {
      const configResponse = await fetch(`${API_BASE}/device/${deviceId}/config`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          lines: selectedLines.map(line => ({
            provider: 'cta-subway',
            line,
            stop: stopId,
          })),
        }),
      });

      if (!configResponse.ok) {
        setStatusText('Failed to save line');
        return;
      }

      await fetch(`${API_BASE}/refresh/device/${deviceId}`, {method: 'POST'});
      setStatusText(`Updated ${selectedLines.join(', ')} at ${stopName} (${stopId})`);
    } catch {
      setStatusText('Network error');
    } finally {
      setIsSaving(false);
    }
  }, [deviceId, selectedLines, stopId, stopName]);

  const lineButtons = useMemo(
    () =>
      availableLines.map(line => (
        <Pressable
          key={line}
          style={[styles.lineChip, selectedLines.includes(line) && styles.lineChipActive]}
          onPress={() => toggleLine(line)}
          disabled={isSaving}>
          <Text style={[styles.lineChipText, selectedLines.includes(line) && styles.lineChipTextActive]}>{line}</Text>
        </Pressable>
      )),
    [availableLines, selectedLines, toggleLine, isSaving],
  );

  return (
    <>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Chicago Station</Text>
        <Text style={styles.hintText}>Choose a CTA station:</Text>
        <View style={styles.stopList}>
          <ScrollView style={styles.stopListScroll} nestedScrollEnabled>
            {CTA_STOPS.map(option => {
              const isSelected = option.stopId.toUpperCase() === stopId.toUpperCase();
              return (
                <Pressable
                  key={option.stopId}
                  style={({pressed}) => [
                    styles.stopItem,
                    isSelected && styles.stopItemSelected,
                    pressed && styles.stopItemPressed,
                  ]}
                  onPress={() => chooseStop(option)}>
                  <Text style={styles.stopItemTitle}>{option.stop}</Text>
                  <Text style={styles.stopItemSubtitle}>{option.stopId}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Chicago Trains</Text>
        <Text style={styles.hintText}>Select up to 2 lines for {stopId}.</Text>
        <Text style={styles.destFixed}>Selected: {selectedLines.join(', ') || 'None'}</Text>

        {availableLines.length === 0 && <Text style={styles.hintText}>No lines configured for this station.</Text>}
        <View style={styles.lineGrid}>{lineButtons}</View>

        <Pressable style={styles.saveButton} onPress={saveConfig} disabled={isSaving}>
          <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save to Device'}</Text>
        </Pressable>

        {!!statusText && <Text style={styles.statusNote}>{statusText}</Text>}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: spacing.sm},
  hintText: {color: colors.textMuted, fontSize: 11, marginBottom: spacing.xs},
  stopList: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  stopListScroll: {maxHeight: 260},
  stopItem: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  stopItemSelected: {
    backgroundColor: colors.accentMuted,
    borderBottomColor: colors.accent,
  },
  stopItemPressed: {opacity: 0.85},
  stopItemTitle: {color: colors.text, fontSize: 12, fontWeight: '700'},
  stopItemSubtitle: {color: colors.textMuted, fontSize: 11},
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
  saveButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  saveButtonText: {color: colors.background, fontSize: 12, fontWeight: '800'},
  statusNote: {color: colors.textMuted, fontSize: 11, marginTop: spacing.sm},
});
