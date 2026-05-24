import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, ActivityIndicator, Alert,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../theme/colors';
import { readingApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

export default function CardDrawScreen({ route, navigation }: any) {
  const { question, category, spreadType, tier } = route.params;
  const [phase, setPhase] = useState<'shuffling' | 'drawing' | 'complete'>('shuffling');
  const [loading, setLoading] = useState(false);
  const shuffleAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef([...Array(10)].map(() => new Animated.Value(0))).current;
  const refreshUser = useAuthStore((s) => s.refreshUser);

  useEffect(() => {
    // Shuffle animation
    const shuffleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shuffleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(shuffleAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    );
    shuffleLoop.start();

    const timer = setTimeout(() => {
      shuffleLoop.stop();
      setPhase('drawing');
      // Reveal cards one by one
      cardAnims.forEach((anim, i) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          delay: i * 300,
          useNativeDriver: true,
        }).start();
      });
    }, 2500);

    return () => {
      clearTimeout(timer);
      shuffleLoop.stop();
    };
  }, []);

  const performReading = async () => {
    setLoading(true);
    try {
      const res = await readingApi.createReading({
        question,
        category,
        spreadType,
        tier,
      }) as any;
      await refreshUser();
      navigation.replace('ReadingResult', { reading: res.data });
    } catch (e: any) {
      Alert.alert('占卜失败', e.message, [
        { text: '返回', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const shuffleTranslate = shuffleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-5, 5],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← 返回</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        {phase === 'shuffling' ? '洗牌中...' : '牌已抽出'}
      </Text>
      <Text style={styles.subtitle}>
        {phase === 'shuffling'
          ? '请静心冥想你的问题'
          : '点击下方按钮开始解读'}
      </Text>

      {/* Card Visualization */}
      <View style={styles.cardArea}>
        {phase === 'shuffling' ? (
          <Animated.View
            style={[
              styles.shuffleDeck,
              { transform: [{ translateX: shuffleTranslate }] },
            ]}
          >
            {[...Array(5)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.deckCard,
                  { top: i * 2, left: i * 3 },
                ]}
              >
                <Text style={styles.deckCardText}>✦</Text>
              </View>
            ))}
          </Animated.View>
        ) : (
          <View style={styles.drawnCards}>
            {cardAnims.slice(0, Math.min(5, cardAnims.length)).map((anim, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.drawnCard,
                  {
                    opacity: anim,
                    transform: [
                      {
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        }),
                      },
                      {
                        scale: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.cardFace}>
                  <Text style={styles.cardSymbol}>✧</Text>
                  <Text style={styles.cardNumber}>{i + 1}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        )}
      </View>

      {/* Mystical Decoration */}
      <View style={styles.decoration}>
        <Text style={styles.decorationText}>━━ ✦ ━━</Text>
      </View>

      {/* Action Button */}
      {phase === 'drawing' && (
        <TouchableOpacity
          style={[styles.readButton, loading && styles.readButtonDisabled]}
          onPress={performReading}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.bgPrimary} />
              <Text style={styles.readButtonText}>解读中...</Text>
            </View>
          ) : (
            <Text style={styles.readButtonText}>🔮 开始解读</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary, padding: spacing.md, paddingTop: 60 },
  back: { marginBottom: spacing.lg },
  backText: { color: colors.textSecondary, fontSize: fontSize.md },
  title: { fontSize: fontSize.xxl, color: colors.gold, fontWeight: 'bold', textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },

  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  shuffleDeck: { width: 120, height: 180, position: 'relative' },
  deckCard: {
    position: 'absolute', width: 120, height: 180,
    backgroundColor: colors.cardBack, borderRadius: borderRadius.md,
    borderWidth: 2, borderColor: colors.goldDim,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  deckCardText: { color: colors.gold, fontSize: 28 },

  drawnCards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  drawnCard: { width: 70, height: 105 },
  cardFace: {
    flex: 1, backgroundColor: colors.cardBack, borderRadius: borderRadius.sm,
    borderWidth: 1.5, borderColor: colors.gold,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  cardSymbol: { color: colors.gold, fontSize: 20 },
  cardNumber: { color: colors.goldLight, fontSize: 12, marginTop: 4 },

  decoration: { alignItems: 'center', marginVertical: spacing.lg },
  decorationText: { color: colors.goldDim, fontSize: fontSize.lg, letterSpacing: 4 },

  readButton: {
    backgroundColor: colors.gold, borderRadius: borderRadius.md,
    paddingVertical: spacing.md, alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  readButtonDisabled: { opacity: 0.7 },
  readButtonText: { color: colors.bgPrimary, fontSize: fontSize.lg, fontWeight: 'bold' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
