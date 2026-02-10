import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useRouter, type Href} from 'expo-router';
import {colors, spacing} from '../theme';

export interface BottomNavItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: Href;
}

interface Props {
  items: BottomNavItem[];
}

export const BottomNav: React.FC<Props> = ({items}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={item.key} style={styles.itemWrap}>
          <Pressable style={styles.item} onPress={() => router.push(item.route)}>
            <Ionicons name={item.icon} size={18} color={colors.accent} />
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
          {index < items.length - 1 ? <View style={styles.divider} /> : null}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  itemWrap: {flexDirection: 'row', alignItems: 'center'},
  item: {alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm},
  divider: {width: 1, height: 28, backgroundColor: colors.border},
  label: {color: colors.textMuted, fontSize: 11, fontWeight: '600'},
});
