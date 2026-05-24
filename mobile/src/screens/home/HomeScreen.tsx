import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { colors, spacing, fontSize, borderRadius } from '../../theme/colors';
import { TAROT_CARDS } from '@tarot/shared';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const user = useAuthStore((s) => s.user);
  const [dailyCard, setDailyCard] = useState(() => {
    const idx = new Date().getDate() % TAROT_CARDS.length;
    return TAROT_CARDS[idx];
  });

  const categories = [
    { key: 'love', label: '💕 感情', desc: '爱情、关系、桃花运', color: '#e74c8b' },
    { key: 'career', label: '💼 事业', desc: '工作、学业、发展', color: '#3b82f6' },
    { key: 'finance', label: '💰 财运', desc: '投资、收入、财务', color: '#f59e0b' },
    { key: 'health', label: '🌿 健康', desc: '身心、养生、状态', color: '#10b981' },
    { key: 'general', label: '✨ 综合', desc: '整体运势、日常指引', color: '#a855f7' },
  ];

  const startReading = (category: string) => {
    navigation.navigate('ReadingFlow', { screen: 'Question', params: { category } });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>你好，{user?.nickname || '探索者'}</Text>
          <Text style={styles.coinText}>🪙 {user?.coinBalance || 0} 金币</Text>
        </View>
        <TouchableOpacity
          style={styles.coinButton}
          onPress={() => navigation.navigate('CoinStore')}
        >
          <Text style={styles.coinButtonText}>充值</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Card */}
      <View style={styles.dailyCard}>
        <View style={styles.dailyCardInner}>
          <Text style={styles.dailyLabel}>✨ 每日一牌</Text>
          <View style={styles.dailyCardVisual}>
            <View style={styles.cardPlaceholder}>
              <Text style={styles.cardEmoji}>🃏</Text>
            </View>
            <View style={styles.dailyCardInfo}>
              <Text style={styles.dailyCardName}>{dailyCard.nameZh}</Text>
              <Text style={styles.dailyCardEn}>{dailyCard.nameEn}</Text>
              <Text style={styles.dailyCardKeywords}>
                {dailyCard.upright.keywords.join(' · ')}
              </Text>
              <Text style={styles.dailyCardMeaning} numberOfLines={3}>
                {dailyCard.upright.general}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Category Selection */}
      <Text style={styles.sectionTitle}>选择占卜方向</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.categoryCard, { borderColor: cat.color + '40' }]}
            onPress={() => startReading(cat.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryLabel}>{cat.label}</Text>
            <Text style={styles.categoryDesc}>{cat.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>快速入口</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => navigation.navigate('ReadingFlow', { screen: 'Question', params: { category: 'general' } })}
        >
          <Text style={styles.quickButtonIcon}>🔮</Text>
          <Text style={styles.quickButtonText}>快速占卜</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => navigation.navigate('CardLibrary')}
        >
          <Text style={styles.quickButtonIcon}>📿</Text>
          <Text style={styles.quickButtonText}>塔罗牌典</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollContent: { paddingHorizontal: spacing.md, paddingTop: 60, paddingBottom: 100 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.lg,
  },
  greeting: { fontSize: fontSize.xl, color: colors.textPrimary, fontWeight: 'bold' },
  coinText: { fontSize: fontSize.sm, color: colors.gold, marginTop: spacing.xs },
  coinButton: {
    backgroundColor: colors.gold, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, borderRadius: borderRadius.full,
  },
  coinButtonText: { color: colors.bgPrimary, fontWeight: 'bold', fontSize: fontSize.sm },

  dailyCard: {
    marginBottom: spacing.lg, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.borderGold,
    backgroundColor: colors.bgCard, overflow: 'hidden',
  },
  dailyCardInner: { padding: spacing.md },
  dailyLabel: { fontSize: fontSize.sm, color: colors.goldLight, marginBottom: spacing.md },
  dailyCardVisual: { flexDirection: 'row', alignItems: 'center' },
  cardPlaceholder: {
    width: 80, height: 120, backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.borderGold,
    justifyContent: 'center', alignItems: 'center',
  },
  cardEmoji: { fontSize: 36 },
  dailyCardInfo: { flex: 1, marginLeft: spacing.md },
  dailyCardName: { fontSize: fontSize.xl, color: colors.textPrimary, fontWeight: 'bold' },
  dailyCardEn: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  dailyCardKeywords: { fontSize: fontSize.sm, color: colors.gold, marginTop: spacing.sm },
  dailyCardMeaning: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 20 },

  sectionTitle: {
    fontSize: fontSize.lg, color: colors.textPrimary,
    fontWeight: 'bold', marginBottom: spacing.md, marginTop: spacing.sm,
  },
  categoriesGrid: { marginBottom: spacing.lg },
  categoryCard: {
    backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm,
  },
  categoryLabel: { fontSize: fontSize.lg, color: colors.textPrimary, fontWeight: 'bold' },
  categoryDesc: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },

  quickActions: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  quickButton: {
    flex: 1, backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderPurple, padding: spacing.lg,
    alignItems: 'center',
  },
  quickButtonIcon: { fontSize: 32, marginBottom: spacing.sm },
  quickButtonText: { fontSize: fontSize.sm, color: colors.textPrimary, fontWeight: 'bold' },
});
