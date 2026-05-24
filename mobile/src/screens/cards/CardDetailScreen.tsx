import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../theme/colors';
import type { TarotCard } from '@tarot/shared';

export default function CardDetailScreen({ route, navigation }: any) {
  const { card } = route.params as { card: TarotCard };
  const [orientation, setOrientation] = useState<'upright' | 'reversed'>('upright');
  const meanings = card[orientation];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← 返回牌典</Text>
      </TouchableOpacity>

      {/* Card Visual */}
      <View style={styles.cardVisual}>
        <View style={styles.cardFrame}>
          <Text style={styles.cardNumber}>
            {card.arcanaType === 'major' ? card.cardNumber : ''}
          </Text>
          <Text style={styles.cardIcon}>
            {card.arcanaType === 'major' ? '✦' : '◆'}
          </Text>
          <Text style={styles.cardNameZh}>{card.nameZh}</Text>
          <Text style={styles.cardNameEn}>{card.nameEn}</Text>
        </View>
      </View>

      {/* Orientation Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, orientation === 'upright' && styles.toggleActive]}
          onPress={() => setOrientation('upright')}
        >
          <Text style={[styles.toggleText, orientation === 'upright' && styles.toggleTextActive]}>
            正位 ↑
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, orientation === 'reversed' && styles.toggleActive]}
          onPress={() => setOrientation('reversed')}
        >
          <Text style={[styles.toggleText, orientation === 'reversed' && styles.toggleTextActive]}>
            逆位 ↓
          </Text>
        </TouchableOpacity>
      </View>

      {/* Keywords */}
      <View style={styles.keywordsRow}>
        {meanings.keywords.map((kw, i) => (
          <View key={i} style={styles.keywordChip}>
            <Text style={styles.keywordText}>{kw}</Text>
          </View>
        ))}
      </View>

      {/* Card Description */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>牌面描述</Text>
        <Text style={styles.sectionText}>{card.description}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>象征意义</Text>
        <Text style={styles.sectionText}>{card.symbolism}</Text>
      </View>

      {/* Meanings */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{orientation === 'upright' ? '正位' : '逆位'}含义</Text>

        <Text style={styles.meaningLabel}>综合</Text>
        <Text style={styles.sectionText}>{meanings.general}</Text>

        <Text style={styles.meaningLabel}>感情</Text>
        <Text style={styles.sectionText}>{meanings.love}</Text>

        <Text style={styles.meaningLabel}>事业</Text>
        <Text style={styles.sectionText}>{meanings.career}</Text>

        <Text style={styles.meaningLabel}>财运</Text>
        <Text style={styles.sectionText}>{meanings.finance}</Text>

        <Text style={styles.meaningLabel}>健康</Text>
        <Text style={styles.sectionText}>{meanings.health}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { padding: spacing.md, paddingTop: 60 },
  back: { marginBottom: spacing.md },
  backText: { color: colors.textSecondary },

  cardVisual: { alignItems: 'center', marginBottom: spacing.lg },
  cardFrame: {
    width: 160, height: 240, backgroundColor: colors.cardBack,
    borderRadius: borderRadius.lg, borderWidth: 2, borderColor: colors.gold,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 10,
  },
  cardNumber: { color: colors.goldDim, fontSize: fontSize.sm },
  cardIcon: { color: colors.gold, fontSize: 36, marginVertical: spacing.sm },
  cardNameZh: { color: colors.gold, fontSize: fontSize.lg, fontWeight: 'bold' },
  cardNameEn: { color: colors.goldDim, fontSize: fontSize.xs, marginTop: 4 },

  toggleRow: {
    flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md,
    backgroundColor: colors.bgCard, borderRadius: borderRadius.full,
    padding: 4,
  },
  toggleBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.full, alignItems: 'center' },
  toggleActive: { backgroundColor: colors.gold + '30' },
  toggleText: { color: colors.textMuted, fontSize: fontSize.sm },
  toggleTextActive: { color: colors.gold, fontWeight: 'bold' },

  keywordsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  keywordChip: {
    backgroundColor: colors.bgSecondary, borderRadius: borderRadius.full,
    borderWidth: 1, borderColor: colors.borderPurple,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  keywordText: { color: colors.purpleLight, fontSize: fontSize.sm },

  sectionCard: {
    backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderGold, padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: { color: colors.gold, fontSize: fontSize.lg, fontWeight: 'bold', marginBottom: spacing.sm },
  sectionText: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 22 },
  meaningLabel: {
    color: colors.textPrimary, fontSize: fontSize.sm, fontWeight: 'bold',
    marginTop: spacing.md, marginBottom: spacing.xs,
    borderBottomWidth: 1, borderBottomColor: colors.borderGold, paddingBottom: spacing.xs,
  },
});
