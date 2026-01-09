import Anthropic from '@anthropic-ai/sdk';
import { LinearTask } from '@/types';

/**
 * Linear MCPを使ってタスクを取得
 * Claude APIを経由してLinear MCPサーバーに接続
 */
export async function getLinearTasks(linearToken: string): Promise<LinearTask[]> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  try {
    // Claude APIにMCP設定を含めてリクエスト
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      // MCP設定
      mcp_servers: [
        {
          type: 'url',
          url: 'https://mcp.linear.app/mcp',
          name: 'linear-mcp',
          // Linear APIトークンを渡す
          headers: {
            Authorization: `Bearer ${linearToken}`,
          },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Linear MCPを使って、以下の条件でタスクを取得してください:
- ステータスが "Todo" または "In Progress" または "Backlog"
- 最大30件
- 優先度順にソート（高い順）

結果を以下のJSON形式で返してください。必ずこの形式を守ってください:
{
  "tasks": [
    {
      "id": "LIN-123",
      "title": "タスクのタイトル",
      "description": "タスクの説明",
      "priority": 1,
      "state": "Todo",
      "dueDate": "2026-01-15"
    }
  ]
}

注意: レスポンスはJSON形式のみで、それ以外の説明文は含めないでください。`,
        },
      ],
    });

    // レスポンスからタスク情報を抽出
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format');
    }

    // JSONレスポンスをパース
    const text = content.text.trim();

    // マークダウンのコードブロックを除去（```json ... ```）
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsed = JSON.parse(jsonText);

    if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
      throw new Error('Invalid response format: tasks array not found');
    }

    return parsed.tasks as LinearTask[];
  } catch (error) {
    console.error('Failed to fetch Linear tasks via MCP:', error);
    throw error;
  }
}
