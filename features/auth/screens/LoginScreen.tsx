import React, {useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {colors, spacing, radii} from '../../../theme';
import {useAppState} from '../../../state/appState';

const HARDCODED_DEVICE_ID = 'esp32-B44AC2F16E20';

export default function LoginScreen() {
  const router = useRouter();
  const {setDeviceId, setDeviceStatus} = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={require('../../../app-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.subtitle}>Access your account to manage your display.</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            setDeviceId(HARDCODED_DEVICE_ID);
            setDeviceStatus('pairedOnline');
            router.push('/dashboard');
          }}>
          <Text style={styles.primaryText}>Log in</Text>
        </Pressable>

        <Pressable style={styles.resetLink}>
          <Text style={styles.resetText}>Forgot password?</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/auth')}>
          <Text style={styles.secondaryText}>Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.lg},
  logo: {width: 160, height: 160, alignSelf: 'center', marginBottom: spacing.xs},
  title: {color: colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center'},
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  field: {marginBottom: spacing.md},
  label: {color: colors.textMuted, fontSize: 13, marginBottom: spacing.sm},
  input: {
    borderRadius: radii.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryText: {color: colors.background, fontWeight: '800', fontSize: 15},
  secondaryButton: {
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  secondaryText: {color: colors.textMuted, fontWeight: '700', fontSize: 13},
  resetLink: {alignItems: 'center', marginTop: spacing.sm},
  resetText: {color: colors.textMuted, fontWeight: '700', fontSize: 12},
});
