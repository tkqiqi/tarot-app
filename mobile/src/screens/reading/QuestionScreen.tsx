import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../theme/colors';

const categoryNames: Record<string, string> = {
  love: '感情',
  career: '事业',
  finance: '财运',
  health: '健康',
  general: '综合',
};

export default function QuestionScreen({ route, navigation }: any) {
  const { category } = route.params || { category: 'general' };
  const [question, setQuestion] = useState('');

  const suggestions: Record<string, string[]> = {
    love: ['我的感情近期会有什么变化？', '我与TA的关系会如何发展？', '近期桃花运如何？'],
    career: ['我的事业发展方向如何？', '换工作是否是好的选择？', '近期工作运势如何？'],
    finance: ['近期财运如何？', '这笔投资是否值得？', '如何改善财务状况？'],
    health: ['近期健康需要注意什么？', '如何改善身心状态？'],
    general: ['我近期的整体运势如何？', '我目前最需要关注什么？', '未来一个月的运势走向？'],
  };

  const proceed = () => {
    if (!question.trim()) {
      Alert.alert('提示', '请输入你的问题');
      return;
    }
    navigation.navigate('SpreadSelect', { question: question.trim(), category });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← 返回</Text>
      </TouchableOpacity>

      <Text style={styles.title}>提出你的问题</Text>
      <Text style={styles.subtitle}>
        关于{categoryNames[category] || '综合'}运势，你想知道什么？
      </Text>

      <TextInput
        style={styles.input}
        placeholder="在此输入你的问题..."
        placeholderTextColor={colors.textMuted}
        value={question}
        onChangeText={setQuestion}
        multiline
        maxLength={200}
      />
      <Text style={styles.charCount}>{question.length}/200</Text>

      <Text style={styles.suggestLabel}>💡 选择或自定义你的问题</Text>
      <View style={styles.suggestions}>
        {(suggestions[category] || suggestions.general).map((s, i) => (
          <TouchableOpacity
            key={i}
            style={styles.suggestChip}
            onPress={() => setQuestion(s)}
          >
            <Text style={styles.suggestText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={proceed}>
        <Text style={styles.nextButtonText}>下一步 · 选择牌阵</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary, padding: spacing.md, paddingTop: 60 },
  back: { marginBottom: spacing.lg },
  backText: { color: colors.textSecondary, fontSize: fontSize.md },
  title: { fontSize: fontSize.xxl, color: colors.gold, fontWeight: 'bold', marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderGold,
    padding: spacing.md, fontSize: fontSize.md,
    color: colors.textPrimary, minHeight: 100, textAlignVertical: 'top',
  },
  charCount: { textAlign: 'right', color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs },
  suggestLabel: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.lg, marginBottom: spacing.sm },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  suggestChip: {
    backgroundColor: colors.bgSecondary, borderRadius: borderRadius.full,
    borderWidth: 1, borderColor: colors.borderPurple,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  suggestText: { color: colors.textPrimary, fontSize: fontSize.sm },
  nextButton: {
    backgroundColor: colors.gold, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: 'center', marginTop: 'auto', marginBottom: spacing.lg,
  },
  nextButtonText: { color: colors.bgPrimary, fontSize: fontSize.lg, fontWeight: 'bold' },
});
