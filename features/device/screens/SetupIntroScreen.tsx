import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {colors, spacing, radii} from '../../../theme';
import {useAppState} from '../../../state/appState';

export default function SetupIntroScreen() {
  const router = useRouter();
  const {setDeviceStatus, setDeviceId} = useAppState();
  const setupSsid = 'Commute-Live-Setup-xxx';
  const statusUrl = 'http://192.168.4.1/status';
  const [selectedNetwork, setSelectedNetwork] = useState('CommuteLive-Home');
  const [wifiUsername, setWifiUsername] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const networks = [
    {name: 'CommuteLive-Home', secure: true, signal: 3},
    {name: 'CommuteLive-Guest', secure: true, signal: 2},
    {name: 'MyHomeWiFi', secure: true, signal: 3},
    {name: 'Apartment-5G', secure: false, signal: 2},
    {name: 'Cafe-WiFi', secure: false, signal: 1},
  ];
  const canConnect = selectedNetwork.length > 0 && wifiPassword.trim().length > 0;

  useEffect(() => {
    setDeviceStatus('notPaired');

    const loadStatus = async () => {
      try {
        const response = await fetch(statusUrl, {method: 'GET'});
        if (!response.ok) return;
        const data = await response.json();
        if (data?.deviceId) {
          setDeviceId(String(data.deviceId));
        }
        if (data?.wifiConnected === true) {
          setDeviceStatus('pairedOnline');
        } else if (data?.wifiConnected === false) {
          setDeviceStatus('pairedOffline');
        }
      } catch {
        // ignore
      }
    };

    loadStatus();
  }, [setDeviceId, setDeviceStatus, statusUrl]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.body}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>Register your device</Text>
          <Text style={styles.subheading}>Complete registration below.</Text>

          <View style={[styles.card, styles.cardSuccess]}>
            <View style={styles.row}>
              <View style={[styles.statusIcon, styles.statusIconSuccess]}>
                <Ionicons name="checkmark" size={20} color={colors.background} />
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.cardTitle}>Connected to “{setupSsid}”</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Device portal (disabled for now)
          {canShowPortal ? (
            <View style={styles.portalWrap}>
              <View style={styles.portalHeader}>
                <Text style={styles.portalTitle}>Device Portal</Text>
                <Text style={styles.portalUrl}>{portalUrl}</Text>
              </View>
              <WebView
                source={{uri: portalUrl}}
                originWhitelist={['*']}
                onError={() => setPortalError(true)}
                onHttpError={() => setPortalError(true)}
                style={styles.webView}
              />
              {portalError ? (
                <Text style={styles.portalError}>
                  Unable to load the portal. Confirm you’re connected to “{setupSsid}”.
                </Text>
              ) : null}
            </View>
          ) : null}
          */}

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Choose a Wi‑Fi network</Text>
              <Pressable style={styles.scanButton}>
                <Ionicons name="refresh" size={14} color={colors.textMuted} />
                <Text style={styles.scanText}>Scan</Text>
              </Pressable>
            </View>
            <View style={styles.networkList}>
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>Networks</Text>
              </View>
              <ScrollView style={styles.networkScroll} nestedScrollEnabled>
                {networks.map(network => (
                  <Pressable
                    key={network.name}
                    style={({pressed}) => [
                      styles.networkRow,
                      selectedNetwork === network.name && styles.networkRowSelected,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => setSelectedNetwork(network.name)}>
                    <View style={styles.networkLeft}>
                      {selectedNetwork === network.name ? (
                        <Ionicons name="checkmark" size={16} color={colors.accent} />
                      ) : (
                        <View style={styles.checkPlaceholder} />
                      )}
                      <Text style={styles.networkName}>{network.name}</Text>
                    </View>
                    <View style={styles.networkRight}>
                      {network.secure ? (
                        <Ionicons name="lock-closed" size={12} color={colors.textMuted} />
                      ) : null}
                      <Ionicons
                        name={
                          network.signal >= 3
                            ? 'wifi'
                            : network.signal === 2
                              ? 'wifi'
                              : 'wifi-outline'
                        }
                        size={14}
                        color={colors.textMuted}
                      />
                      <Ionicons
                        name="information-circle-outline"
                        size={16}
                        color={colors.textMuted}
                      />
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.selectedRow}>
              <Text style={styles.selectedLabel}>Selected network</Text>
              <Text style={styles.selectedValue}>{selectedNetwork}</Text>
            </View>
            <Text style={styles.sectionTitle}>Wi‑Fi credentials</Text>
            <TextInput
              value={wifiUsername}
              onChangeText={setWifiUsername}
              placeholder="Username (optional)"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              value={wifiPassword}
              onChangeText={setWifiPassword}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              style={styles.input}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.primaryButton, !canConnect && styles.primaryButtonDisabled]}
            disabled={!canConnect}>
            <Text style={[styles.primaryText, !canConnect && styles.primaryTextDisabled]}>
              Connect to Wi‑Fi
            </Text>
          </Pressable>
          <Pressable style={styles.finishLink} onPress={() => router.push('/dashboard')}>
            <Text style={styles.finishText}>Finish setup</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  body: {flex: 1},
  content: {padding: spacing.lg, paddingBottom: spacing.xl},
  heading: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subheading: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  textWrap: {flex: 1},
  cardTitle: {color: colors.text, fontSize: 14, fontWeight: '700'},
  cardSuccess: {borderColor: colors.success},
  cardError: {borderColor: colors.warning},
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconSuccess: {backgroundColor: colors.success},
  statusIconWarning: {backgroundColor: colors.warning},
  statusIconError: {backgroundColor: colors.warning},
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  portalWrap: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  portalHeader: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  portalTitle: {color: colors.text, fontSize: 14, fontWeight: '700'},
  portalUrl: {color: colors.textMuted, fontSize: 12, marginTop: 2},
  webView: {height: 380, backgroundColor: colors.surface},
  portalError: {color: colors.warning, fontSize: 12, padding: spacing.md},
  section: {marginTop: spacing.sm},
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionHeader: {color: colors.text, fontSize: 14, fontWeight: '700'},
  sectionTitle: {color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: spacing.sm},
  scanButton: {
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scanText: {color: colors.textMuted, fontSize: 12, fontWeight: '700'},
  networkList: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  networkScroll: {maxHeight: 220},
  listHeader: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listHeaderText: {color: colors.textMuted, fontSize: 12, fontWeight: '700'},
  networkRow: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  networkRowSelected: {backgroundColor: '#0B1115'},
  networkLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1},
  checkPlaceholder: {width: 16, height: 16},
  networkName: {color: colors.text, fontWeight: '600'},
  networkRight: {flexDirection: 'row', alignItems: 'center', gap: 8},
  selectedRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: colors.card,
    marginBottom: spacing.md,
  },
  selectedLabel: {color: colors.textMuted, fontSize: 12},
  selectedValue: {color: colors.text, fontWeight: '700', marginTop: 4},
  input: {
    borderRadius: radii.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  primaryButtonDisabled: {backgroundColor: colors.border},
  primaryText: {color: colors.background, fontWeight: '800', fontSize: 14},
  primaryTextDisabled: {color: colors.textMuted},
  pressed: {opacity: 0.85},
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  finishLink: {alignItems: 'center', marginTop: spacing.md},
  finishText: {color: colors.textMuted, fontWeight: '700', fontSize: 13},
});
