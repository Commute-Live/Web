import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
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
  {stopId: '41220', stop: 'Fullerton', direction: ''},
  {stopId: '41320', stop: 'Belmont', direction: ''},
  {stopId: '40360', stop: 'Southport', direction: ''},
  {stopId: '40660', stop: 'Armitage', direction: ''},
  {stopId: '40530', stop: 'Diversey', direction: ''},
  {stopId: '40080', stop: 'Sheridan', direction: ''},
  {stopId: '40540', stop: 'Wilson', direction: ''},
  {stopId: '40050', stop: 'Davis', direction: ''},
  {stopId: '40690', stop: 'Dempster', direction: ''},
  {stopId: '41050', stop: 'Linden', direction: ''},
  {stopId: '40710', stop: 'Chicago (Brown/Purple)', direction: ''},
  {stopId: '41410', stop: 'Chicago (Blue)', direction: ''},
  {stopId: '41450', stop: 'Chicago (Red)', direction: ''},
  {stopId: '40790', stop: 'Monroe (Blue)', direction: ''},
  {stopId: '41090', stop: 'Monroe (Red)', direction: ''},
  {stopId: '40070', stop: 'Jackson (Blue)', direction: ''},
  {stopId: '40560', stop: 'Jackson (Red)', direction: ''},
  {stopId: '40400', stop: 'Noyes', direction: ''},
  {stopId: '40270', stop: 'Main', direction: ''},
  {stopId: '40840', stop: 'South Boulevard', direction: ''},
  {stopId: '41250', stop: 'Central (Purple)', direction: ''},
  {stopId: '40100', stop: 'Morse', direction: ''},
  {stopId: '41190', stop: 'Jarvis', direction: ''},
  {stopId: '40880', stop: 'Thorndale', direction: ''},
  {stopId: '40760', stop: 'Granville', direction: ''},
  {stopId: '41380', stop: 'Bryn Mawr', direction: ''},
  {stopId: '41200', stop: 'Argyle', direction: ''},
  {stopId: '41420', stop: 'Addison (Red)', direction: ''},
  {stopId: '41300', stop: 'Loyola', direction: ''},
  {stopId: '40770', stop: 'Lawrence', direction: ''},
  {stopId: '40040', stop: 'Quincy/Wells', direction: ''},
  {stopId: '40260', stop: 'State/Lake', direction: ''},
  {stopId: '40680', stop: 'Adams/Wabash', direction: ''},
  {stopId: '41700', stop: 'Washington/Wabash', direction: ''},
  {stopId: '40850', stop: 'Harold Washington Library-State/Van Buren', direction: ''},
  {stopId: '40160', stop: 'LaSalle/Van Buren', direction: ''},
  {stopId: '40730', stop: 'Washington/Wells', direction: ''},
  {stopId: '40460', stop: 'Merchandise Mart', direction: ''},
  {stopId: '41180', stop: 'Kedzie (Brown)', direction: ''},
  {stopId: '40870', stop: 'Francisco', direction: ''},
  {stopId: '41010', stop: 'Rockwell', direction: ''},
  {stopId: '41310', stop: 'Paulina', direction: ''},
  {stopId: '40090', stop: 'Damen (Brown)', direction: ''},
  {stopId: '41480', stop: 'Western (Brown)', direction: ''},
  {stopId: '41440', stop: 'Addison (Brown)', direction: ''},
  {stopId: '41500', stop: 'Montrose (Brown)', direction: ''},
  {stopId: '41460', stop: 'Irving Park (Brown)', direction: ''},
  {stopId: '41290', stop: 'Kimball', direction: ''},
  {stopId: '40230', stop: 'Cumberland', direction: ''},
  {stopId: '40820', stop: 'Rosemont', direction: ''},
  {stopId: '41280', stop: 'Jefferson Park', direction: ''},
  {stopId: '40550', stop: 'Irving Park (Blue)', direction: ''},
  {stopId: '41330', stop: 'Montrose (Blue)', direction: ''},
  {stopId: '40970', stop: 'Cicero (Blue)', direction: ''},
  {stopId: '40920', stop: 'Pulaski (Blue)', direction: ''},
  {stopId: '40250', stop: 'Kedzie-Homan', direction: ''},
  {stopId: '40590', stop: 'Damen (Blue)', direction: ''},
  {stopId: '40350', stop: 'UIC-Halsted', direction: ''},
  {stopId: '40470', stop: 'Racine', direction: ''},
  {stopId: '40430', stop: 'Clinton (Blue)', direction: ''},
  {stopId: '40370', stop: 'Washington (Blue)', direction: ''},
  {stopId: '40320', stop: 'Division', direction: ''},
  {stopId: '41020', stop: 'Logan Square', direction: ''},
  {stopId: '40670', stop: "Western (Blue - O'Hare)", direction: ''},
  {stopId: '40570', stop: 'California (Blue)', direction: ''},
  {stopId: '40060', stop: 'Belmont (Blue)', direction: ''},
  {stopId: '41240', stop: 'Addison (Blue)', direction: ''},
  {stopId: '40390', stop: 'Forest Park', direction: ''},
  {stopId: '40180', stop: 'Oak Park (Blue)', direction: ''},
  {stopId: '40010', stop: 'Austin (Blue)', direction: ''},
  {stopId: '40330', stop: 'Grand (Red)', direction: ''},
  {stopId: '41660', stop: 'Lake (Red)', direction: ''},
  {stopId: '40630', stop: 'Clark/Division', direction: ''},
  {stopId: '40650', stop: 'North/Clybourn', direction: ''},
  {stopId: '41230', stop: '47th (Red)', direction: ''},
  {stopId: '40990', stop: '69th (Red)', direction: ''},
  {stopId: '40240', stop: '79th (Red)', direction: ''},
  {stopId: '41430', stop: '87th (Red)', direction: ''},
  {stopId: '41170', stop: 'Garfield (Red)', direction: ''},
  {stopId: '40910', stop: '63rd (Red)', direction: ''},
  {stopId: '40190', stop: 'Sox-35th', direction: ''},
  {stopId: '41000', stop: 'Cermak-Chinatown', direction: ''},
  {stopId: '41490', stop: 'Harrison', direction: ''},
  {stopId: '41350', stop: 'Oak Park (Green)', direction: ''},
  {stopId: '41260', stop: 'Austin (Green)', direction: ''},
  {stopId: '40700', stop: 'Laramie', direction: ''},
  {stopId: '40480', stop: 'Cicero (Green)', direction: ''},
  {stopId: '41070', stop: 'Kedzie (Green)', direction: ''},
  {stopId: '41360', stop: 'California (Green)', direction: ''},
  {stopId: '40170', stop: 'Ashland (Green/Pink)', direction: ''},
  {stopId: '41160', stop: 'Clinton (Green/Pink)', direction: ''},
  {stopId: '41510', stop: 'Morgan', direction: ''},
  {stopId: '41710', stop: 'Damen (Green)', direction: ''},
  {stopId: '41690', stop: 'Cermak-McCormick Place', direction: ''},
  {stopId: '41120', stop: '35th-Bronzeville-IIT', direction: ''},
  {stopId: '41270', stop: '43rd', direction: ''},
  {stopId: '41080', stop: '47th (Green)', direction: ''},
  {stopId: '40130', stop: '51st', direction: ''},
  {stopId: '41140', stop: 'King Drive', direction: ''},
  {stopId: '40300', stop: 'Indiana', direction: ''},
  {stopId: '40290', stop: 'Ashland/63rd', direction: ''},
  {stopId: '40720', stop: 'Cottage Grove', direction: ''},
  {stopId: '40120', stop: '35th/Archer', direction: ''},
  {stopId: '41060', stop: 'Ashland (Orange)', direction: ''},
  {stopId: '41130', stop: 'Halsted (Orange)', direction: ''},
  {stopId: '41150', stop: 'Kedzie (Orange)', direction: ''},
  {stopId: '40960', stop: 'Pulaski (Orange)', direction: ''},
  {stopId: '40310', stop: 'Western (Orange)', direction: ''},
  {stopId: '40930', stop: 'Midway', direction: ''},
  {stopId: '40580', stop: '54th/Cermak', direction: ''},
  {stopId: '40420', stop: 'Cicero (Pink)', direction: ''},
  {stopId: '41040', stop: 'Kedzie (Pink)', direction: ''},
  {stopId: '40600', stop: 'Kostner', direction: ''},
  {stopId: '40780', stop: 'Central Park', direction: ''},
  {stopId: '40440', stop: 'California (Pink)', direction: ''},
  {stopId: '40210', stop: 'Damen (Pink)', direction: ''},
  {stopId: '41030', stop: 'Polk', direction: ''},
  {stopId: '40830', stop: '18th', direction: ''},
  {stopId: '40740', stop: 'Western (Pink)', direction: ''},
  {stopId: '40140', stop: 'Dempster-Skokie', direction: ''},
  {stopId: '41680', stop: 'Oakton-Skokie', direction: ''},
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
  const [stopQuery, setStopQuery] = useState('');

  const filteredStops = useMemo(() => {
    const q = stopQuery.trim().toLowerCase();
    if (!q) return CTA_STOPS;
    return CTA_STOPS.filter(
      option =>
        option.stop.toLowerCase().includes(q) ||
        option.stopId.toLowerCase().includes(q),
    );
  }, [stopQuery]);

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
        <Text style={styles.hintText}>Choose a CTA station (full list):</Text>
        <TextInput
          value={stopQuery}
          onChangeText={setStopQuery}
          placeholder="Search CTA station"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <View style={styles.stopList}>
          <ScrollView style={styles.stopListScroll} nestedScrollEnabled>
            {filteredStops.map(option => {
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
  input: {
    borderRadius: radii.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
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
