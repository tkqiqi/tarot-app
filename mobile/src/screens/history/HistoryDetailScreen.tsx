import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../theme/colors';
import type { Reading, ReadingResult } from '@tarot/shared';

export default function HistoryDetailScreen({ route, navigation }: any) {
  const { reading } = route.params as { reading: Reading };
  const result = reading.result as ReadingResult | null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← 返回</Text>
      </TouchableOpacity>
      <Text style={styles.title}>占卜详情</Text>
      <View style={styles.infoCard}>
        <Text style={styles.label}>问题</Text>
        <Text style={styles.value}>{reading.question}</Text>
        <Text style={styles.label}>时间</Text>
        <Text style={styles.value}>{new Date(reading.createdAt).toLocaleString('zh-CN')}</Text>
        <Text style={styles.label}>类型</Text>
        <Text style={styles.value}>{reading.tier === 'deep' ? '✨ 深度解析' : '🔮 基础解读'}</Text>
      </View>
      {result ? (
        <View>
          {result.cardInterpretations.map((ci, i) => (
            <View key={i} style={styles.interpCard}>
              <Text style={styles.interpTitle}>{ci.positionName}：{ci.cardName}</Text>
              <Text style={styles.interpText}>{ci.interpretation}</Text>
            </View>
          ))}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>🔮 占卜结果</Text>
            <Text style={styles.sectionText}>{result.divinationResult}</Text>
          </View>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>💡 建议</Text>
            <Text style={styles.sectionText}>{result.advice}</Text>
          </View>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>📜 谶语</Text>
            <Text style={styles.sectionText}>{result.prophecy}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noResult}>暂无解读结果</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { padding: spacing.md, paddingTop: 60 },
  back: { marginBottom: spacing.md },
  backText: { color: colors.textSecondary },
  title: { fontSize: fontSize.xxl, color: colors.gold, fontWeight: 'bold', marginBottom: spacing.lg },
  infoCard: { backgroundColor: colors.bgCard, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.borderGold, padding: spacing.md, marginBottom: spacing.md },
  label: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.sm },
  value: { color: colors.textPrimary, fontSize: fontSize.md, marginTop: 2 },
  interpCard: { backgroundColor: colors.bgSecondary, borderRadius: borderRadius.sm, padding: spacing.sm, marginBottom: spacing.sm, borderLeftWidth: 3, borderLeftColor: colors.gold },
  interpTitle: { color: colors.gold, fontSize: fontSize.sm, fontWeight: 'bold', marginBottom: spacing.xs },
  interpText: { color: colors.textSecondary, fontSize: fontSize.xs, lineHeight: 20 },
  sectionCard: { backgroundColor: colors.bgCard, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.borderGold, padding: spacing.md, marginBottom: spacing.sm },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: 'bold', marginBottom: spacing.sm },
  sectionText: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 22 },
  noResult: { color: colors.textMuted, fontSize: fontSize.md, textAlign: 'center', marginTop: spacing.xl },
});
