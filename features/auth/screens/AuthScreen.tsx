import React from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {colors, spacing, radii} from '../../../theme';
import {ExternalLink} from '../../../components/ExternalLink';

export default function AuthScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Image source={require('../../../app-logo.png')} style={styles.logo} resizeMode="contain" />
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>

          <Text style={styles.title}>CommuteLive</Text>
          <Text style={styles.subtitle}>Transit arrival board for your home and office display.</Text>
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>What you can do</Text>
          <Text style={styles.previewRow}>Pick your station and lines</Text>
          <Text style={styles.previewRow}>Sync updates to your device in seconds</Text>
          <Text style={styles.previewRow}>See next arrivals at a glance</Text>
        </View>

        <Pressable style={styles.primaryButton} onPress={() => router.push('/login')}>
          <Text style={styles.primaryText}>Log In</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/sign-up')}>
          <Text style={styles.secondaryText}>Create Account</Text>
        </Pressable>

        <View style={styles.legalRow}>
          <Text style={styles.legalText}>By continuing, you agree to our </Text>
          <ExternalLink href="https://example.com/terms">
            <Text style={styles.legalLink}>Terms</Text>
          </ExternalLink>
          <Text style={styles.legalText}> and </Text>
          <ExternalLink href="https://example.com/privacy">
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </ExternalLink>
          <Text style={styles.legalText}>.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.lg, paddingBottom: spacing.xl},
  heroCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  heroTopRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  logo: {width: 84, height: 84},
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.surface,
  },
  liveDot: {width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success},
  liveText: {color: colors.textMuted, fontSize: 11, fontWeight: '700'},
  title: {color: colors.text, fontSize: 28, fontWeight: '800', marginTop: spacing.sm},
  subtitle: {color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: spacing.xs},
  previewCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  previewTitle: {color: colors.text, fontSize: 13, fontWeight: '800', marginBottom: spacing.xs},
  previewRow: {color: colors.textMuted, fontSize: 13, marginTop: 2},
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  primaryText: {color: colors.background, fontWeight: '800', fontSize: 15},
  secondaryButton: {
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  secondaryText: {color: colors.text, fontWeight: '700', fontSize: 15},
  legalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  legalText: {color: colors.textMuted, fontSize: 12},
  legalLink: {color: colors.accent, fontSize: 12, fontWeight: '700'},
});
