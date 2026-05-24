import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../theme/colors';
import { readingApi } from '../../services/api';
import type { Reading } from '@tarot/shared';

const categoryEmoji: Record<string, string> = {
  love: '💕', career: '💼', finance: '💰', health: '🌿', general: '✨',
};
const categoryLabel: Record<string, string> = {
  love: '感情', career: '事业', finance: '财运', health: '健康', general: '综合',
};

export default function HistoryListScreen({ navigation }: any) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReadings = useCallback(async () => {
    try {
      const res = await readingApi.getReadings(50, 0) as any;
      setReadings(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadReadings);
    return unsubscribe;
  }, [navigation, loadReadings]);

  const renderItem = ({ item }: { item: Reading }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HistoryDetail', { reading: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardEmoji}>{categoryEmoji[item.category] || '✨'}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardCategory}>{categoryLabel[item.category] || '综合'}运势</Text>
          <Text style={styles.cardDate}>
            {new Date(item.createdAt).toLocaleDateString('zh-CN', {
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit',
            })}
          </Text>
        </View>
        <View style={[styles.tierBadge, item.tier === 'deep' && styles.tierBadgeDeep]}>
          <Text style={[styles.tierText, item.tier === 'deep' && styles.tierTextDeep]}>
            {item.tier === 'deep' ? '深度' : '基础'}
          </Text>
        </View>
      </View>
      <Text style={styles.cardQuestion} numberOfLines={2}>{item.question}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>占卜记录</Text>
      {readings.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🔮</Text>
          <Text style={styles.emptyText}>还没有占卜记录</Text>
          <Text style={styles.emptySubtext}>去开始你的第一次占卜吧</Text>
        </View>
      ) : (
        <FlatList
          data={readings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); loadReadings(); }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary, paddingTop: 60 },
  title: { fontSize: fontSize.xxl, color: colors.gold, fontWeight: 'bold', paddingHorizontal: spacing.md, marginBottom: spacing.md },
  list: { paddingHorizontal: spacing.md, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { color: colors.textSecondary, fontSize: fontSize.lg },
  emptySubtext: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.xs },

  card: {
    backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderGold, padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  cardEmoji: { fontSize: 24, marginRight: spacing.sm },
  cardInfo: { flex: 1 },
  cardCategory: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: 'bold' },
  cardDate: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  tierBadge: { backgroundColor: colors.bgSecondary, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full },
  tierBadgeDeep: { backgroundColor: colors.purple + '30' },
  tierText: { color: colors.textMuted, fontSize: fontSize.xs },
  tierTextDeep: { color: colors.purpleLight, fontSize: fontSize.xs },
  cardQuestion: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 20 },
});
