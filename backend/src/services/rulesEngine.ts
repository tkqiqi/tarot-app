import type {
  DrawnCard,
  ReadingResult,
  ThinkingProcess,
  CardInterpretation,
  QuestionCategory,
} from '@tarot/shared';

export function generateReading(
  drawnCards: DrawnCard[],
  question: string,
  category: QuestionCategory
): ReadingResult {
  const thinkingProcess = generateThinkingProcess(question, category, drawnCards);
  const cardInterpretations = drawnCards.map((dc) => interpretCard(dc, category));
  const overallInterpretation = generateOverallInterpretation(drawnCards, category);
  const divinationResult = generateDivinationResult(drawnCards, question, category);
  const advice = generateAdvice(drawnCards, category);
  const prophecy = generateProphecy(drawnCards, category);
  const futureTrends = generateFutureTrends(drawnCards, category);
  const notes = generateNotes(drawnCards, category);

  return {
    thinkingProcess,
    cardInterpretations,
    overallInterpretation,
    divinationResult,
    advice,
    prophecy,
    futureTrends,
    notes,
  };
}

function generateThinkingProcess(
  question: string,
  category: QuestionCategory,
  cards: DrawnCard[]
): ThinkingProcess {
  const categoryMap: Record<QuestionCategory, string> = {
    love: '感情',
    career: '事业',
    finance: '财运',
    health: '健康',
    general: '综合运势',
  };
  const cardNames = cards.map((c) => `${c.card.nameZh}(${c.orientation === 'reversed' ? '逆位' : '正位'})`).join('、');

  return {
    goal: `为求问者解读关于"${question}"的塔罗占卜结果`,
    progress: `已完成抽牌，共${cards.length}张牌：${cardNames}`,
    intent: `深入分析牌面含义，结合${categoryMap[category]}领域给出全面解读`,
    attitude: '保持专业、客观、充满智慧的解读态度',
    thinking: `需要从牌面的象征意义、正逆位特征、各牌之间的关联性三个维度进行分析，同时结合求问者的问题背景给出个性化解读`,
    action: '按照标准输出格式，逐张解读牌面，再给出整体综合分析',
    ability: '知识检索, 直觉引导, 情感共鸣, 元素和符号理解',
  };
}

function interpretCard(card: DrawnCard, category: QuestionCategory): CardInterpretation {
  const { card: tarotCard, orientation, position } = card;
  const meanings = orientation === 'upright' ? tarotCard.upright : tarotCard.reversed;
  const orientationText = orientation === 'reversed' ? '逆位' : '正位';

  const categoryMeaning = getCategoryMeaning(meanings, category);

  const interpretation = `【${tarotCard.nameZh}·${orientationText}】

牌面描述：${tarotCard.description}

画面中蕴含着深刻的象征意义：${tarotCard.symbolism}

在"${position.nameZh}"这一位置上，${tarotCard.nameZh}${orientationText}的核心含义是：${meanings.general}

关键词：${meanings.keywords.join('、')}

具体到当前所问的领域，${categoryMeaning}

这张牌落在"${position.nameZh}"的位置，意味着${position.description}。${tarotCard.nameZh}${orientationText}在这一位置提醒我们：${getPositionInsight(tarotCard.nameZh, orientation, position.nameZh)}`;

  return {
    positionName: position.nameZh,
    cardName: `${tarotCard.nameZh}·${orientationText}`,
    orientation,
    interpretation,
  };
}

function getCategoryMeaning(meanings: { general: string; love: string; career: string; finance: string; health: string }, category: QuestionCategory): string {
  const map: Record<QuestionCategory, string> = {
    love: `在感情方面，${meanings.love}`,
    career: `在事业方面，${meanings.career}`,
    finance: `在财运方面，${meanings.finance}`,
    health: `在健康方面，${meanings.health}`,
    general: `综合来看，${meanings.general}`,
  };
  return map[category];
}

function getPositionInsight(cardName: string, orientation: CardOrientation, positionName: string): string {
  const posInsights: Record<string, Record<string, string>> = {
    '过去': {
      default: `${cardName}${orientation === 'reversed' ? '逆位' : '正位'}揭示了过去经历对当前状况的深远影响。过去的事件和选择为现在埋下了伏笔，需要从中汲取智慧。`,
    },
    '现在': {
      default: `${cardName}${orientation === 'reversed' ? '逆位' : '正位'}精确地描绘了你此刻的状态和处境。这张牌在核心位置的出现，强调了当前决策的重要性。`,
    },
    '未来': {
      default: `${cardName}${orientation === 'reversed' ? '逆位' : '正位'}为未来的走向提供了重要线索。但这并非不可改变的宿命，而是提醒你关注的方向。`,
    },
    '现况': {
      default: `${cardName}${orientation === 'reversed' ? '逆位' : '正位'}是整个牌阵的核心，它揭示了你目前最需要关注的核心议题。`,
    },
    '挑战': {
      default: `${cardName}${orientation === 'reversed' ? '逆位' : '正位'}出现在挑战位置，提示你需要面对和克服的障碍。认清挑战是战胜它的第一步。`,
    },
    '指引': {
      default: `${cardName}${orientation === 'reversed' ? '逆位' : '正位'}是宇宙给你的直接指引。请认真倾听这张牌传达的讯息。`,
    },
  };

  return posInsights[positionName]?.default
    || `${cardName}${orientation === 'reversed' ? '逆位' : '正位'}在"${positionName}"位置上展现了独特的信息，需要结合整体牌阵来理解其深层含义。`;
}

function generateOverallInterpretation(cards: DrawnCard[], category: QuestionCategory): string {
  const uprightCount = cards.filter((c) => c.orientation === 'upright').length;
  const reversedCount = cards.length - uprightCount;

  const majorCount = cards.filter((c) => c.card.arcanaType === 'major').length;
  const minorCount = cards.length - majorCount;

  let overall = `纵观整个牌阵，`;
  overall += `共有${cards.length}张牌参与了这次占卜。`;
  overall += `其中${uprightCount}张正位，${reversedCount}张逆位。`;

  if (uprightCount > reversedCount) {
    overall += `正位牌占多数，说明整体能量偏向积极和顺畅，事情的发展总体上是有利的。`;
  } else if (reversedCount > uprightCount) {
    overall += `逆位牌占多数，提示当前存在一些需要关注的挑战和阻碍，但这些逆位牌也在提醒你需要从不同角度审视问题。`;
  } else {
    overall += `正逆位数量均衡，表明事情正处于一个关键的转折点，你的选择和行动将决定最终的走向。`;
  }

  if (majorCount > 0) {
    overall += `牌阵中出现了${majorCount}张大阿卡那牌，这意味着此次占卜涉及的议题对你的人生具有深远而重大的意义，值得你给予高度重视。`;
  }

  if (minorCount > 0) {
    const suits = new Set(cards.filter((c) => c.card.suit).map((c) => c.card.suit));
    const suitNames: Record<string, string> = {
      wands: '权杖（火元素·行动与激情）',
      cups: '圣杯（水元素·情感与直觉）',
      swords: '宝剑（风元素·思维与沟通）',
      pentacles: '星币（土元素·物质与实际）',
    };
    const suitList = [...suits].map((s) => suitNames[s!] || s).join('、');
    overall += `小阿卡那牌中涉及了${suitList}的元素，这些元素共同编织出了你当前处境的完整画面。`;
  }

  return overall;
}

function generateDivinationResult(cards: DrawnCard[], question: string, _category: QuestionCategory): string {
  const coreCards = cards.slice(0, Math.min(3, cards.length));
  const coreNames = coreCards.map((c) => `${c.card.nameZh}(${c.orientation === 'reversed' ? '逆位' : '正位'})`).join('与');

  let result = `针对你的问题"${question}"，塔罗牌给出了明确的回应。\n\n`;
  result += `核心牌${coreNames}构成了这次占卜的主旋律。`;

  const positiveCards = coreCards.filter(
    (c) => c.orientation === 'upright' &&
    (c.card.upright.keywords.some((k) => ['成功', '和谐', '幸福', '繁荣', '希望', '爱', '光明', '力量', '智慧'].includes(k)))
  );

  if (positiveCards.length > 0) {
    result += `从牌面来看，这是一个相当积极的信号。宇宙的能量正在向有利于你的方向流动。`;
    result += `牌阵传递的核心信息是：保持信心，顺应内心的直觉，好事正在向你靠近。`;
  } else {
    result += `牌面虽然呈现出一些复杂的信号，但这正是塔罗的智慧所在——它在提醒你关注那些容易被忽视的细节。`;
    result += `牌阵传递的核心信息是：保持清醒的头脑，审慎地评估当前状况，做出明智的选择。`;
  }

  return result;
}

function generateAdvice(cards: DrawnCard[], category: QuestionCategory): string {
  const categoryAdvice: Record<QuestionCategory, string[]> = {
    love: [
      '保持开放的心态去接纳新的可能性',
      '学会倾听内心真实的声音，不要被外在的期待所左右',
      '在感情中保持真诚，但也要守护好自己的边界',
      '信任直觉，它往往比理性更能触及真相',
    ],
    career: [
      '专注于提升自身的核心竞争力',
      '保持耐心，成功需要时间的积累',
      '善于把握时机，在对的时间做对的事',
      '与同事和上级保持良好的沟通关系',
    ],
    finance: [
      '理性消费，做好财务规划',
      '关注长期投资回报而非短期利益',
      '谨慎评估风险，不要被贪婪蒙蔽判断',
      '开源节流并重，稳步积累财富',
    ],
    health: [
      '注重身心平衡，不要忽视精神健康',
      '保持规律的作息和适度的运动',
      '学会释放压力，找到适合自己的放松方式',
      '关注身体发出的信号，及时调整',
    ],
    general: [
      '保持内心的平静和清明',
      '相信自己的直觉和判断',
      '在行动前做好充分的准备',
      '保持感恩之心，珍惜当下拥有的一切',
    ],
  };

  const adviceList = categoryAdvice[category];
  let advice = `根据牌阵的指引，为你提供以下建议：\n\n`;
  adviceList.forEach((a, i) => {
    advice += `${i + 1}. ${a}\n`;
  });
  advice += `\n此外，牌阵特别提醒你：${cards[0].card.nameZh}${cards[0].orientation === 'reversed' ? '逆位' : '正位'}的能量暗示你，当下最重要的事是${cards[0].orientation === 'upright' ? '顺势而为，把握当前的良好势头' : '放慢脚步，重新审视自己的方向和方法'}。`;

  return advice;
}

function generateProphecy(cards: DrawnCard[], _category: QuestionCategory): string {
  const prophecyTemplates = [
    `星辰运转，命运之轮正在悄然转动。${cards[0].card.nameZh}的出现宛如一盏明灯，照亮了前路的方向。古老的智慧告诉我们：每一次低谷都是为了迎接更高的山峰，每一次迷茫都是通往觉醒的必经之路。`,
    `在命运的织锦上，${cards.map((c) => c.card.nameZh).join('、')}共同编织出了一幅独特的图景。塔罗的预言并非不可更改的宿命，而是引导你走向更高智慧的路标。顺应内心的指引，你将找到属于自己的答案。`,
    `月光洒落在命运的星盘上，${cards[0].card.nameZh}与${cards[1].card.nameZh}的能量交织共振。这是一个关于成长与蜕变的预言——你正站在一个新的起点上，勇敢地迈出脚步，美好的未来正在等待着你。`,
  ];

  return prophecyTemplates[Math.floor(Math.random() * prophecyTemplates.length)];
}

function generateFutureTrends(cards: DrawnCard[], _category: QuestionCategory): string {
  const futureCards = cards.length >= 3 ? cards.slice(-3) : cards;
  let trends = `根据牌面信息对未来趋势的预测：\n\n`;

  futureCards.forEach((dc, i) => {
    const period = i === 0 ? '近期' : i === 1 ? '中期' : '远期';
    const orientation = dc.orientation === 'upright' ? '正位' : '逆位';
    trends += `${period}趋势 — ${dc.card.nameZh}·${orientation}：`;
    if (dc.orientation === 'upright') {
      trends += `${dc.card.upright.general}正位的${dc.card.nameZh}带来积极的能量，整体趋势向好。\n\n`;
    } else {
      trends += `${dc.card.reversed.general}逆位提醒你需要关注潜在的挑战，提前做好准备。\n\n`;
    }
  });

  trends += `需要注意的是，未来并非一成不变。塔罗展示的是当前能量轨迹下的可能走向，你的每一个选择和行动都有可能改变这个轨迹。保持觉知，灵活应对。`;
  return trends;
}

function generateNotes(cards: DrawnCard[], _category: QuestionCategory): string {
  const reversedCards = cards.filter((c) => c.orientation === 'reversed');
  let notes = `【注意事项】\n\n`;

  if (reversedCards.length > 0) {
    notes += `本次占卜中出现了${reversedCards.length}张逆位牌，需要特别留意：\n`;
    reversedCards.forEach((dc) => {
      notes += `- ${dc.card.nameZh}逆位：${dc.card.reversed.keywords.join('、')}。注意${dc.card.reversed.general.slice(0, 50)}...\n`;
    });
    notes += '\n';
  }

  notes += `重要提醒：\n`;
  notes += `1. 塔罗占卜是自我探索的工具，不是绝对的命运预言\n`;
  notes += `2. 牌面的建议需要结合你的实际情况来理解和运用\n`;
  notes += `3. 如果感到困惑，不妨在一段时间后再次占卜，获取新的视角\n`;
  notes += `4. 保持积极的心态，命运始终掌握在你自己手中`;

  return notes;
}
