// Tarot Card Types
export type ArcanaType = 'major' | 'minor';
export type SuitType = 'wands' | 'cups' | 'swords' | 'pentacles';
export type CardOrientation = 'upright' | 'reversed';

export interface TarotCard {
  id: number;
  cardNumber: number;
  arcanaType: ArcanaType;
  suit: SuitType | null;
  nameEn: string;
  nameZh: string;
  imagePath: string;
  upright: CardMeaning;
  reversed: CardMeaning;
  description: string;
  symbolism: string;
}

export interface CardMeaning {
  keywords: string[];
  general: string;
  love: string;
  career: string;
  finance: string;
  health: string;
}

// Spread Types
export type SpreadType = 'single' | 'three_card' | 'celtic_cross' | 'hexagram' | 'crossroads';

export interface SpreadPosition {
  index: number;
  name: string;
  nameZh: string;
  description: string;
  x: number; // 0-100 percentage for layout
  y: number;
}

export interface SpreadDefinition {
  id: number;
  type: SpreadType;
  name: string;
  nameZh: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
  bestFor: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Reading Types
export type ReadingTier = 'free' | 'deep';
export type ReadingStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type QuestionCategory = 'love' | 'career' | 'finance' | 'health' | 'general';

export interface DrawnCard {
  card: TarotCard;
  orientation: CardOrientation;
  position: SpreadPosition;
}

export interface Reading {
  id: string;
  userId: string;
  question: string;
  category: QuestionCategory;
  spreadType: SpreadType;
  tier: ReadingTier;
  drawnCards: DrawnCard[];
  result: ReadingResult | null;
  status: ReadingStatus;
  createdAt: string;
  completedAt: string | null;
}

export interface ReadingResult {
  thinkingProcess: ThinkingProcess;
  cardInterpretations: CardInterpretation[];
  overallInterpretation: string;
  divinationResult: string;
  advice: string;
  prophecy: string;
  futureTrends: string;
  notes: string;
}

export interface ThinkingProcess {
  goal: string;
  progress: string;
  intent: string;
  attitude: string;
  thinking: string;
  action: string;
  ability: string;
}

export interface CardInterpretation {
  positionName: string;
  cardName: string;
  orientation: CardOrientation;
  interpretation: string;
}

// User Types
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  nickname: string;
  avatarUrl: string;
  coinBalance: number;
  role: UserRole;
  dailyFreeCount: number;
  dailyFreeUsed: number;
  dailyFreeResetAt: string | null;
  createdAt: string;
}

// Payment Types
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentChannel = 'wechat' | 'alipay';

export interface CoinPackage {
  id: number;
  name: string;
  nameZh: string;
  coins: number;
  price: number; // in cents
  originalPrice: number;
  description: string;
  isActive: boolean;
}

export interface PaymentOrder {
  id: string;
  userId: string;
  packageId: number;
  amount: number;
  channel: PaymentChannel;
  status: PaymentStatus;
  transactionId: string | null;
  createdAt: string;
  paidAt: string | null;
}

// API Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  error?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nickname?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface CreateReadingRequest {
  question: string;
  category: QuestionCategory;
  spreadType: SpreadType;
  tier: ReadingTier;
}

export interface AdminConfig {
  claudeApiKey: string;
  claudeApiUrl: string;
  claudeModel: string;
  deepAnalysisCost: number;
  dailyFreeCount: number;
  coinPackages: CoinPackage[];
}
