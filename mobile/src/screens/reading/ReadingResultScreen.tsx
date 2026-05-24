import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../theme/colors';
import { readingApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { Reading, ReadingResult, ThinkingProcess } from '@tarot/shared';

const sections = [
  { key: 'cardInterpretations', title: '🃏 牌面解读', icon: '🃏' },
  { key: 'overallInterpretation', title: '🌟 牌阵整体解读', icon: '🌟' },
  { key: 'divinationResult', title: '🔮 占卜结果', icon: '🔮' },
  { key: 'advice', title: '💡 建议', icon: '💡' },
  { key: 'prophecy', title: '📜 谶语', icon: '📜' },
  { key: 'futureTrends', title: '🌈 未来趋势', icon: '🌈' },
  { key: 'notes', title: '⚠️ 注意事项', icon: '⚠️' },
] as const;

export default function ReadingResultScreen({ route, navigation }: any) {
  const { reading } = route.params as { reading: Reading };
  const result = reading.result as ReadingResult;
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['cardInterpretations']));
  const [upgrading, setUpgrading] = useState(false);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleUpgrade = async () => {
    Alert.alert('升级深度解析', '将消耗5金币进行AI深度解析，是否继续？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认',
        onPress: async () => {
          setUpgrading(true);
          try {
            const res = await readingApi.upgradeReading(reading.id) as any;
            await refreshUser();
            navigation.replace('ReadingResult', { reading: res.data });
          } catch (e: any) {
            Alert.alert('升级失败', e.message);
          } finally {
            setUpgrading(false);
          }
        },
      },
    ]);
  };

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>解读结果加载失败</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('HomeTab')}>
        <Text style={styles.backText}>← 返回首页</Text>
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>占卜解读</Text>
        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>
            {reading.tier === 'deep' ? '✨ 深度解析' : '🔮 基础解读'}
          </Text>
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionCard}>
        <Text style={styles.questionLabel}>你的问题</Text>
        <Text style={styles.questionText}>{reading.question}</Text>
      </View>

      {/* Thinking Process */}
      <View style={styles.thinkingCard}>
        <Text style={styles.thinkingTitle}>🧠 思考过程</Text>
        <ThinkingRow label="目标" value={result.thinkingProcess.goal} />
        <ThinkingRow label="进度" value={result.thinkingProcess.progress} />
        <ThinkingRow label="意图" value={result.thinkingProcess.intent} />
        <ThinkingRow label="态度" value={result.thinkingProcess.attitude} />
        <ThinkingRow label="思考" value={result.thinkingProcess.thinking} />
        <ThinkingRow label="行动" value={result.thinkingProcess.action} />
        <ThinkingRow label="能力" value={result.thinkingProcess.ability} />
      </View>

      {/* Sections */}
      {sections.map((section) => (
        <TouchableOpacity
          key={section.key}
          style={styles.sectionCard}
          onPress={() => toggleSection(section.key)}
          activeOpacity={0.8}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionToggle}>
              {expandedSections.has(section.key) ? '▼' : '▶'}
            </Text>
          </View>
          {expandedSections.has(section.key) && (
            <View style={styles.sectionContent}>
              {section.key === 'cardInterpretations' ? (
                result.cardInterpretations.map((ci, i) => (
                  <View key={i} style={styles.cardInterpCard}>
                    <Text style={styles.cardInterpTitle}>
                      {ci.positionName}：{ci.cardName}
                    </Text>
                    <Text style={styles.cardInterpText}>{ci.interpretation}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.sectionText}>
                  {(result as any)[section.key]}
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      ))}

      {/* Upgrade Button (only for free tier) */}
      {reading.tier === 'free' && (
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={handleUpgrade}
          disabled={upgrading}
        >
          <Text style={styles.upgradeButtonText}>
            ✨ 升级为AI深度解析 · 🪙 5金币
          </Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

function ThinkingRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.thinkingRow}>
      <Text style={styles.thinkingLabel}>（{label}）</Text>
      <Text style={styles.thinkingValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollContent: { padding: spacing.md, paddingTop: 60 },
  back: { marginBottom: spacing.md },
  backText: { color: colors.textSecondary, fontSize: fontSize.md },
  errorText: { color: colors.error, fontSize: fontSize.lg, textAlign: 'center', marginTop: 100 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  headerTitle: { fontSize: fontSize.xxl, color: colors.gold, fontWeight: 'bold' },
  tierBadge: { backgroundColor: colors.purple + '30', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full },
  tierText: { color: colors.purpleLight, fontSize: fontSize.xs },

  questionCard: {
    backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderGold, padding: spacing.md, marginBottom: spacing.md,
  },
  questionLabel: { color: colors.textMuted, fontSize: fontSize.xs, marginBottom: spacing.xs },
  questionText: { color: colors.textPrimary, fontSize: fontSize.md, lineHeight: 24 },

  thinkingCard: {
    backgroundColor: colors.bgSecondary, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderPurple, padding: spacing.md, marginBottom: spacing.md,
  },
  thinkingTitle: { color: colors.purpleLight, fontSize: fontSize.md, fontWeight: 'bold', marginBottom: spacing.sm },
  thinkingRow: { flexDirection: 'row', marginBottom: spacing.xs },
  thinkingLabel: { color: colors.textMuted, fontSize: fontSize.xs, width: 50 },
  thinkingValue: { color: colors.textSecondary, fontSize: fontSize.xs, flex: 1 },

  sectionCard: {
    backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderGold, marginBottom: spacing.sm, overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: spacing.md,
  },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: 'bold' },
  sectionToggle: { color: colors.gold, fontSize: fontSize.sm },
  sectionContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  sectionText: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 22 },

  cardInterpCard: {
    backgroundColor: colors.bgSecondary, borderRadius: borderRadius.sm,
    padding: spacing.sm, marginBottom: spacing.sm,
    borderLeftWidth: 3, borderLeftColor: colors.gold,
  },
  cardInterpTitle: { color: colors.gold, fontSize: fontSize.sm, fontWeight: 'bold', marginBottom: spacing.xs },
  cardInterpText: { color: colors.textSecondary, fontSize: fontSize.xs, lineHeight: 20 },

  upgradeButton: {
    backgroundColor: colors.purple, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.md,
    borderWidth: 1, borderColor: colors.purpleLight,
  },
  upgradeButtonText: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: 'bold' },
});
