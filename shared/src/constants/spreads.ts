import type { SpreadDefinition } from '../types';

export const SPREADS: SpreadDefinition[] = [
  {
    id: 1,
    type: 'single',
    name: 'Single Card Draw',
    nameZh: '单牌占卜',
    description: '抽取一张牌，获得当下最需要的指引和启示。适合日常快速提问。',
    cardCount: 1,
    positions: [
      { index: 0, name: 'Guidance', nameZh: '指引', description: '当下你需要的指引', x: 50, y: 50 },
    ],
    bestFor: ['daily', 'quick_question', 'general'],
    difficulty: 'beginner',
  },
  {
    id: 2,
    type: 'three_card',
    name: 'Three Card Spread',
    nameZh: '三牌阵（过去·现在·未来）',
    description: '经典的三牌阵，分别代表过去、现在和未来。揭示事件的时间线和发展趋势。',
    cardCount: 3,
    positions: [
      { index: 0, name: 'Past', nameZh: '过去', description: '影响当前状况的过去因素', x: 20, y: 50 },
      { index: 1, name: 'Present', nameZh: '现在', description: '当前的核心状况', x: 50, y: 50 },
      { index: 2, name: 'Future', nameZh: '未来', description: '事情可能的发展方向', x: 80, y: 50 },
    ],
    bestFor: ['love', 'career', 'general', 'timeline'],
    difficulty: 'beginner',
  },
  {
    id: 3,
    type: 'hexagram',
    name: 'Hexagram Spread',
    nameZh: '六芒星阵',
    description: '六芒星阵涵盖问题的各个方面——原因、过去、现在、未来、环境和希望。适合深入分析复杂问题。',
    cardCount: 6,
    positions: [
      { index: 0, name: 'Cause', nameZh: '原因', description: '问题的根本原因', x: 50, y: 15 },
      { index: 1, name: 'Past', nameZh: '过去', description: '过去的影响力', x: 20, y: 40 },
      { index: 2, name: 'Present', nameZh: '现在', description: '当前状况', x: 80, y: 40 },
      { index: 3, name: 'Future', nameZh: '未来', description: '未来可能的发展', x: 20, y: 70 },
      { index: 4, name: 'Environment', nameZh: '环境', description: '周围环境的影响', x: 80, y: 70 },
      { index: 5, name: 'Hope', nameZh: '希望', description: '你的期望与最终指引', x: 50, y: 90 },
    ],
    bestFor: ['career', 'finance', 'health', 'complex'],
    difficulty: 'intermediate',
  },
  {
    id: 4,
    type: 'celtic_cross',
    name: 'Celtic Cross',
    nameZh: '凯尔特十字阵',
    description: '最经典也最复杂的牌阵，共十张牌。全面揭示问题的核心、挑战、潜意识、近期和远期趋势。适合深度占卜。',
    cardCount: 10,
    positions: [
      { index: 0, name: 'Present', nameZh: '现况', description: '你目前的核心处境', x: 38, y: 45 },
      { index: 1, name: 'Challenge', nameZh: '挑战', description: '当前面临的挑战或障碍', x: 38, y: 45 },
      { index: 2, name: 'Foundation', nameZh: '根基', description: '问题的潜意识根源', x: 38, y: 75 },
      { index: 3, name: 'Recent Past', nameZh: '近期过去', description: '刚刚发生的影响', x: 15, y: 45 },
      { index: 4, name: 'Best Outcome', nameZh: '最佳结果', description: '可能的最佳结果', x: 38, y: 20 },
      { index: 5, name: 'Near Future', nameZh: '近期未来', description: '即将发生的事', x: 38, y: 45 },
      { index: 6, name: 'Self Attitude', nameZh: '自我态度', description: '你对此事的态度', x: 75, y: 90 },
      { index: 7, name: 'Environment', nameZh: '外部环境', description: '周围人和环境的影响', x: 75, y: 70 },
      { index: 8, name: 'Hopes & Fears', nameZh: '希望与恐惧', description: '你内心的希望或恐惧', x: 75, y: 50 },
      { index: 9, name: 'Final Outcome', nameZh: '最终结果', description: '最终的综合结果', x: 75, y: 30 },
    ],
    bestFor: ['love', 'career', 'finance', 'health', 'general', 'deep'],
    difficulty: 'advanced',
  },
  {
    id: 5,
    type: 'crossroads',
    name: 'Crossroads Spread',
    nameZh: '抉择十字阵',
    description: '当你面临重要抉择时使用。揭示两条路的前景和建议，帮助你做出明智的决定。',
    cardCount: 5,
    positions: [
      { index: 0, name: 'Current', nameZh: '现状', description: '你目前的处境', x: 50, y: 50 },
      { index: 1, name: 'Path A', nameZh: '选择A', description: '第一条路的前景', x: 20, y: 25 },
      { index: 2, name: 'Path A Result', nameZh: 'A的结果', description: '选择A可能带来的结果', x: 20, y: 75 },
      { index: 3, name: 'Path B', nameZh: '选择B', description: '第二条路的前景', x: 80, y: 25 },
      { index: 4, name: 'Path B Result', nameZh: 'B的结果', description: '选择B可能带来的结果', x: 80, y: 75 },
    ],
    bestFor: ['career', 'love', 'decision'],
    difficulty: 'intermediate',
  },
];

export const getSpreadByType = (type: string): SpreadDefinition | undefined => {
  return SPREADS.find((s) => s.type === type);
};

export const getSpreadsByCategory = (category: string): SpreadDefinition[] => {
  return SPREADS.filter((s) => s.bestFor.includes(category));
};
