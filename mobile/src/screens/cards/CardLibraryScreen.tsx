import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput,
} from 'react-native';
import { TAROT_CARDS } from '@tarot/shared';
import { colors, spacing, fontSize, borderRadius } from '../../theme/colors';
import type { TarotCard } from '@tarot/shared';

export default function CardLibraryScreen({ navigation }: any) {
  const [filter, setFilter] = useState<'all' | 'major' | 'minor'>('all');
  const [search, setSearch] = useState('');

  const filtered = TAROT_CARDS.filter((card) => {
    if (filter === 'major' && card.arcanaType !== 'major') return false;
    if (filter === 'minor' && card.arcanaType !== 'minor') return false;
    if (search && !card.nameZh.includes(search) && !card.nameEn.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const renderCard = ({ item }: { item: TarotCard }) => (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => navigation.navigate('CardDetail', { card: item })}
    >
      <View style={styles.cardVisual}>
        <Text style={styles.cardIcon}>{item.arcanaType === 'major' ? '✦' : '◆'}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.nameZh}</Text>
        <Text style={styles.cardEn}>{item.nameEn}</Text>
        {item.suit && <Text style={styles.cardSuit}>{getSuitLabel(item.suit)}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>塔罗牌典</Text>
      <Text style={styles.subtitle}>探索78张塔罗牌的奥秘</Text>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="搜索塔罗牌..."
        placeholderTextColor={colors.textMuted}
        value={search}
        onChangeText={setSearch}
      />

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'major', 'minor'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? '全部' : f === 'major' ? '大阿卡那' : '小阿卡那'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.countText}>共 {filtered.length} 张牌</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCard}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

function getSuitLabel(suit: string): string {
  const map: Record<string, string> = {
    wands: '🔥 权杖',
    cups: '💧 圣杯',
    swords: '💨 宝剑',
    pentacles: '🌍 星币',
  };
  return map[suit] || suit;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary, paddingTop: 60, paddingHorizontal: spacing.md },
  title: { fontSize: fontSize.xxl, color: colors.gold, fontWeight: 'bold' },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md },

  searchInput: {
    backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderGold,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    color: colors.textPrimary, fontSize: fontSize.sm, marginBottom: spacing.md,
  },

  filterRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  filterTab: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, backgroundColor: colors.bgCard,
    borderWidth: 1, borderColor: colors.borderGold,
  },
  filterTabActive: { backgroundColor: colors.gold + '20', borderColor: colors.gold },
  filterText: { color: colors.textMuted, fontSize: fontSize.xs },
  filterTextActive: { color: colors.gold, fontWeight: 'bold' },

  countText: { color: colors.textMuted, fontSize: fontSize.xs, marginBottom: spacing.sm },
  list: { paddingBottom: 100 },

  cardItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderGold,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  cardVisual: {
    width: 48, height: 64, backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.goldDim,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.md,
  },
  cardIcon: { color: colors.gold, fontSize: 20 },
  cardInfo: { flex: 1 },
  cardName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: 'bold' },
  cardEn: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  cardSuit: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 4 },
});
