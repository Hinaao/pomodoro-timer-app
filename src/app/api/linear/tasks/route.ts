import { NextRequest, NextResponse } from 'next/server';
import { getLinearTasks } from '@/lib/linear-client';

/**
 * Linear タスク取得 API
 * GET /api/linear/tasks
 */
export async function GET(request: NextRequest) {
  try {
    // リクエストヘッダーからLinear APIトークンを取得
    const linearToken = request.headers.get('x-linear-token');

    if (!linearToken) {
      return NextResponse.json({ error: 'Linear API token is required' }, { status: 401 });
    }

    // ANTHROPIC_API_KEYの存在確認
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error: API key not set' },
        { status: 500 }
      );
    }

    // Linear MCPを使ってタスク取得
    const tasks = await getLinearTasks(linearToken);

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Failed to fetch Linear tasks:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
