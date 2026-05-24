import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { colors, spacing, fontSize, borderRadius } from '../../theme/colors';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确认', onPress: logout, style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>个人中心</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🔮</Text>
        </View>
        <Text style={styles.nickname}>{user?.nickname || '探索者'}</Text>
        <Text style={styles.username}>@{user?.username}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🪙 {user?.coinBalance || 0}</Text>
          <Text style={styles.statLabel}>金币余额</Text>
        </View>
        <TouchableOpacity
          style={styles.rechargeButton}
          onPress={() => navigation.navigate('CoinStore')}
        >
          <Text style={styles.rechargeText}>充值</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuList}>
        <MenuItem label="占卜记录" icon="📜" onPress={() => navigation.navigate('History')} />
        <MenuItem label="塔罗牌典" icon="📿" onPress={() => navigation.navigate('CardLibrary')} />
        <MenuItem label="金币商城" icon="🪙" onPress={() => navigation.navigate('CoinStore')} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </View>
  );
}

function MenuItem({ label, icon, onPress }: { label: string; icon: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary, paddingTop: 60, paddingHorizontal: spacing.md },
  title: { fontSize: fontSize.xxl, color: colors.gold, fontWeight: 'bold', marginBottom: spacing.lg },

  profileCard: {
    backgroundColor: colors.bgCard, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.borderGold, padding: spacing.lg,
    alignItems: 'center', marginBottom: spacing.lg,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.bgSecondary,
    borderWidth: 2, borderColor: colors.gold, justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { fontSize: 32 },
  nickname: { fontSize: fontSize.xl, color: colors.textPrimary, fontWeight: 'bold' },
  username: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 4 },

  statsRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1, backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderGold, padding: spacing.md, alignItems: 'center',
  },
  statValue: { fontSize: fontSize.xl, color: colors.gold, fontWeight: 'bold' },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.xs },
  rechargeButton: {
    backgroundColor: colors.gold, borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  rechargeText: { color: colors.bgPrimary, fontWeight: 'bold' },

  menuList: { marginBottom: spacing.lg },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgCard, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderGold,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  menuIcon: { fontSize: 20, marginRight: spacing.md },
  menuLabel: { flex: 1, color: colors.textPrimary, fontSize: fontSize.md },
  menuArrow: { color: colors.textMuted, fontSize: fontSize.xl },

  logoutButton: {
    borderWidth: 1, borderColor: colors.error + '60',
    borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center',
    marginTop: 'auto', marginBottom: spacing.xxl,
  },
  logoutText: { color: colors.error, fontSize: fontSize.md },
});
