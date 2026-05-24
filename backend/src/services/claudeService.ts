import type { DrawnCard, ReadingResult, QuestionCategory } from '@tarot/shared';
import { prepare } from '../config/database';

function getConfigValue(key: string, fallback: string = ''): string {
  const row = prepare('SELECT value FROM admin_config WHERE key = ?').get(key) as any;
  return row?.value || fallback;
}

const TAROT_SYSTEM_PROMPT = `你是一名经验丰富的专业塔罗牌占卜师，熟悉各种牌阵及其背后的象征意义。根据用户提出的问题和抽出的牌阵，你提供详细的解读。

[要求]
- 每次输出必须始终遵循指定的输出格式
- 必须对牌面的画面元素进行完整描述并且解释
- 根据每张牌在牌阵中的顺序解读其含义
- 解读内容至少1000字
- 语言风格：保持优雅、带有神秘气息

[思考过程]
在解读前，展示你的思考过程：
(目标) 当前的目标
(进度) 进展情况
(意图) 你的意图
(态度) 对生成内容的态度
(思考) 应该包含哪些方面
(行动) 合理的下一步
(能力) 需要运用的能力

[输出格式]
**牌面解读**
<牌阵位置>：<牌面信息>：<牌面解读>

**牌阵整体解读**
<结合所有牌的总体解读>

**占卜结果**
<占卜结果正文>

**建议**
<建议正文>

**谶语**
<谶语正文>

**未来趋势**
<根据牌面信息预测未来的可能趋势>

**注意事项**
<客户在未来需要注意的事项或可能的挑战>`;

export async function generateDeepReading(
  drawnCards: DrawnCard[],
  question: string,
  category: QuestionCategory
): Promise<ReadingResult> {
  const apiKey = getConfigValue('claude_api_key');
  const apiUrl = getConfigValue('claude_api_url', 'https://api.anthropic.com');
  const model = getConfigValue('claude_model', 'claude-sonnet-4-6');

  if (!apiKey) {
    throw new Error('深度分析功能暂未配置，请联系管理员');
  }

  const cardDescriptions = drawnCards
    .map(
      (dc, i) =>
        `位置${i + 1}（${dc.position.nameZh}）：${dc.card.nameZh} · ${dc.orientation === 'reversed' ? '逆位' : '正位'}\n牌面描述：${dc.card.description}\n象征意义：${dc.card.symbolism}`
    )
    .join('\n\n');

  const categoryMap: Record<QuestionCategory, string> = {
    love: '感情',
    career: '事业',
    finance: '财运',
    health: '健康',
    general: '综合运势',
  };

  const userMessage = `问题：${question}
问题类别：${categoryMap[category]}
牌阵信息：
${cardDescriptions}

请按照你的角色设定和输出格式，对以上牌阵进行详细的专业解读。`;

  try {
    const response = await fetch(`${apiUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: TAROT_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as {
      content: Array<{ type: string; text: string }>;
    };

    const aiText = data.content.map((c) => c.text).join('\n');
    return parseAIResponse(aiText, drawnCards);
  } catch (error) {
    console.error('Claude API call failed:', error);
    throw new Error('AI 深度分析暂时不可用，请稍后重试');
  }
}

function parseAIResponse(aiText: string, drawnCards: DrawnCard[]): ReadingResult {
  const sections = extractSections(aiText);

  return {
    thinkingProcess: {
      goal: '基于AI深度分析进行全面解读',
      progress: `已完成${drawnCards.length}张牌的深度解读`,
      intent: '提供专业、深入、个性化的塔罗占卜解读',
      attitude: '以专业的占卜师视角，给予温暖而有深度的指引',
      thinking: '综合分析牌面象征意义、牌阵位置关系、各元素间的互动',
      action: '输出完整的占卜解读报告',
      ability: '知识检索, 直觉引导, 情感共鸣, 元素和符号理解, 语境结合, 情境推理',
    },
    cardInterpretations: drawnCards.map((dc) => ({
      positionName: dc.position.nameZh,
      cardName: `${dc.card.nameZh}·${dc.orientation === 'reversed' ? '逆位' : '正位'}`,
      orientation: dc.orientation,
      interpretation: `【${dc.card.nameZh}·${dc.orientation === 'reversed' ? '逆位' : '正位'}】\n${dc.card.description}\n\n${dc.card.upright.general}`,
    })),
    overallInterpretation: sections['牌阵整体解读'] || '整体解读生成中...',
    divinationResult: sections['占卜结果'] || '占卜结果生成中...',
    advice: sections['建议'] || '建议生成中...',
    prophecy: sections['谶语'] || '谶语生成中...',
    futureTrends: sections['未来趋势'] || '未来趋势生成中...',
    notes: sections['注意事项'] || '注意事项生成中...',
  };
}

function extractSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const patterns = [
    '牌面解读',
    '牌阵整体解读',
    '占卜结果',
    '建议',
    '谶语',
    '未来趋势',
    '注意事项',
  ];

  for (let i = 0; i < patterns.length; i++) {
    const sectionName = patterns[i];
    const startMarker = `**${sectionName}**`;
    const nextSection = patterns[i + 1] ? `**${patterns[i + 1]}**` : null;

    const startIdx = text.indexOf(startMarker);
    if (startIdx !== -1) {
      const contentStart = startIdx + startMarker.length;
      const endIdx = nextSection ? text.indexOf(nextSection, contentStart) : text.length;
      const content = endIdx !== -1 ? text.slice(contentStart, endIdx) : text.slice(contentStart);
      sections[sectionName] = content.trim();
    }
  }

  return sections;
}
