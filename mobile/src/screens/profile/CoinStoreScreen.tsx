import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';

interface CoinPackage {
  id: number;
  name_zh: string;
  coins: number;
  price: number;
  original_price: number;
  description: string;
}

export default function CoinStoreScreen({ navigation }: any) {
  const user = useAuthStore((s) => s.user);
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const api = (await import('../../services/api')).default;
      const res = await api.get('/admin/packages') as any;
      setPackages(res.data.filter((p: any) => p.is_active));
    } catch {
      // Fallback packages
      setPackages([
        { id: 1, name_zh: '体验包', coins: 10, price: 600, original_price: 600, description: '首次体验深度解析' },
        { id: 2, name_zh: '标准包', coins: 30, price: 1500, original_price: 1800, description: '最受用户欢迎' },
        { id: 3, name_zh: '高级包', coins: 68, price: 2800, original_price: 4080, description: '深度占卜爱好者首选' },
        { id: 4, name_zh: '至尊包', coins: 168, price: 5800, original_price: 10080, description: '无限探索塔罗奥秘' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (pkg: CoinPackage) => {
    Alert.alert(
      '购买确认',
      `${pkg.name_zh}：${pkg.coins}金币 / ¥${(pkg.price / 100).toFixed(2)}\n\n（支付功能开发中，敬请期待）`,
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => Alert.alert('提示', '支付功能即将上线，敬请期待！') },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← 返回</Text>
      </TouchableOpacity>

      <Text style={styles.title}>金币商城</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>当前余额</Text>
        <Text style={styles.balanceValue}>🪙 {user?.coinBalance || 0}</Text>
        <Text style={styles.balanceHint}>1次深度解析 = 5金币</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.gold} size="large" style={{ marginTop: spacing.xl }} />
      ) : (
        packages.map((pkg) => (
          <TouchableOpacity
            key={pkg.id}
            style={styles.packageCard}
            onPress={() => handlePurchase(pkg)}
            activeOpacity={0.8}
          >
            <View style={styles.packageHeader}>
              <Text style={styles.packageName}>{pkg.name_zh}</Text>
              {pkg.original_price > pkg.price && (
                <View style={styles.saveBadge}>
                  <Text style={styles.saveText}>省¥{((pkg.original_price - pkg.price) / 100).toFixed(0)}</Text>
                </View>
              )}
            </View>
            <View style={styles.packageBody}>
              <View style={styles.packageLeft}>
                <Text style={styles.packageCoins}>🪙 {pkg.coins}</Text>
                <Text style={styles.packageDesc}>{pkg.description}</Text>
              </View>
              <View style={styles.packageRight}>
                <Text style={styles.packagePrice}>¥{(pkg.price / 100).toFixed(2)}</Text>
                {pkg.original_price > pkg.price && (
                  <Text style={styles.packageOriginal}>¥{(pkg.original_price / 100).toFixed(2)}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}

      <View style={styles.tip}>
        <Text style={styles.tipText}>💡 金币用于解锁AI深度解析功能，每次深度解析消耗5金币</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { padding: spacing.md, paddingTop: 60, paddingBottom: 40 },
  back: { marginBottom: spacing.md },
  backText: { color: colors.textSecondary },
  title: { fontSize: fontSize.xxl, color: colors.gold, fontWeight: 'bold', marginBottom: spacing.lg },

  balanceCard: {
    backgroundColor: colors.bgCard, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.gold, padding: spacing.lg,
    alignItems: 'center', marginBottom: spacing.lg,
  },
  balanceLabel: { color: colors.textMuted, fontSize: fontSize.sm },
  balanceValue: { color: colors.gold, fontSize: fontSize.title, fontWeight: 'bold', marginVertical: spacing.sm },
  balanceHint: { color: colors.textSecondary, fontSize: fontSize.xs },

  packageCard: {
    backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderGold, padding: spacing.md,
    marginBottom: spacing.md,
  },
  packageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  packageName: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: 'bold' },
  saveBadge: { backgroundColor: colors.error + '20', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  saveText: { color: colors.error, fontSize: fontSize.xs, fontWeight: 'bold' },
  packageBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  packageLeft: { flex: 1 },
  packageCoins: { color: colors.gold, fontSize: fontSize.xl, fontWeight: 'bold' },
  packageDesc: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs },
  packageRight: { alignItems: 'flex-end' },
  packagePrice: { color: colors.gold, fontSize: fontSize.xl, fontWeight: 'bold' },
  packageOriginal: { color: colors.textMuted, fontSize: fontSize.sm, textDecorationLine: 'line-through' },

  tip: { backgroundColor: colors.bgSecondary, borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.sm },
  tipText: { color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center' },
});
