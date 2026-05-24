import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { SPREADS } from '@tarot/shared';
import { colors, spacing, fontSize, borderRadius } from '../../theme/colors';
import type { ReadingTier } from '@tarot/shared';

const difficultyColors: Record<string, string> = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
};
const difficultyLabels: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
};

export default function SpreadSelectScreen({ route, navigation }: any) {
  const { question, category } = route.params;
  const [selectedTier, setSelectedTier] = useState<ReadingTier>('free');

  const selectSpread = (spreadType: string) => {
    navigation.navigate('CardDraw', {
      question,
      category,
      spreadType,
      tier: selectedTier,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← 返回</Text>
      </TouchableOpacity>

      <Text style={styles.title}>选择牌阵</Text>
      <Text style={styles.subtitle}>选择适合你问题的牌阵</Text>

      {/* Tier Selection */}
      <View style={styles.tierContainer}>
        <TouchableOpacity
          style={[styles.tierCard, selectedTier === 'free' && styles.tierCardActive]}
          onPress={() => setSelectedTier('free')}
        >
          <Text style={styles.tierIcon}>🔮</Text>
          <Text style={[styles.tierTitle, selectedTier === 'free' && styles.tierTitleActive]}>
            免费解读
          </Text>
          <Text style={styles.tierDesc}>预设规则引擎</Text>
          <Text style={styles.tierPrice}>免费</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tierCard, styles.tierCardPremium, selectedTier === 'deep' && styles.tierCardDeepActive]}
          onPress={() => setSelectedTier('deep')}
        >
          <Text style={styles.tierIcon}>✨</Text>
          <Text style={[styles.tierTitle, selectedTier === 'deep' && styles.tierTitleActive]}>
            深度解析
          </Text>
          <Text style={styles.tierDesc}>AI 智能解读</Text>
          <Text style={styles.tierPrice}>🪙 5 金币</Text>
        </TouchableOpacity>
      </View>

      {/* Spread List */}
      {SPREADS.map((spread) => (
        <TouchableOpacity
          key={spread.id}
          style={styles.spreadCard}
          onPress={() => selectSpread(spread.type)}
          activeOpacity={0.7}
        >
          <View style={styles.spreadHeader}>
            <Text style={styles.spreadName}>{spread.nameZh}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColors[spread.difficulty] + '30' }]}>
              <Text style={[styles.difficultyText, { color: difficultyColors[spread.difficulty] }]}>
                {difficultyLabels[spread.difficulty]}
              </Text>
            </View>
          </View>
          <Text style={styles.spreadDesc}>{spread.description}</Text>
          <View style={styles.spreadMeta}>
            <Text style={styles.spreadMetaText}>🃏 {spread.cardCount} 张牌</Text>
            <View style={styles.bestForContainer}>
              {spread.bestFor.slice(0, 3).map((b) => (
                <View key={b} style={styles.tagChip}>
                  <Text style={styles.tagText}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollContent: { padding: spacing.md, paddingTop: 60, paddingBottom: 40 },
  back: { marginBottom: spacing.lg },
  backText: { color: colors.textSecondary, fontSize: fontSize.md },
  title: { fontSize: fontSize.xxl, color: colors.gold, fontWeight: 'bold', marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.lg },

  tierContainer: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  tierCard: {
    flex: 1, backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderGold, padding: spacing.md, alignItems: 'center',
  },
  tierCardActive: { borderColor: colors.gold, backgroundColor: colors.gold + '15' },
  tierCardPremium: { borderColor: colors.purpleLight + '60' },
  tierCardDeepActive: { borderColor: colors.purpleLight, backgroundColor: colors.purpleLight + '15' },
  tierIcon: { fontSize: 28, marginBottom: spacing.sm },
  tierTitle: { fontSize: fontSize.md, color: colors.textPrimary, fontWeight: 'bold' },
  tierTitleActive: { color: colors.gold },
  tierDesc: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.xs },
  tierPrice: { fontSize: fontSize.sm, color: colors.gold, marginTop: spacing.sm, fontWeight: 'bold' },

  spreadCard: {
    backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderGold, padding: spacing.md,
    marginBottom: spacing.md,
  },
  spreadHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  spreadName: { fontSize: fontSize.lg, color: colors.textPrimary, fontWeight: 'bold' },
  difficultyBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full },
  difficultyText: { fontSize: fontSize.xs, fontWeight: 'bold' },
  spreadDesc: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
  spreadMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  spreadMetaText: { fontSize: fontSize.xs, color: colors.textMuted },
  bestForContainer: { flexDirection: 'row', gap: 4 },
  tagChip: { backgroundColor: colors.bgSecondary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagText: { fontSize: 10, color: colors.textMuted },
});
