import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(req: NextRequest) {
  try {
    const { playerId } = await req.json();

    if (typeof playerId !== 'number') {
      return NextResponse.json({ error: 'Invalid playerId' }, { status: 400 });
    }

    const result = await turso.execute({
      sql: 'SELECT * FROM Sessions WHERE playerid = ?',
      args: [playerId],
    });

    const sessions = result.rows.map(row => ({
      sid: row.sid as number,
      playerid: row.playerid as number,
      gameid: row.gameid as number,
      profitloss: row.profitloss as number,
    }));

    return NextResponse.json({ sessions, success: true });
  } catch (err) {
    console.error('Session fetch failed:', err);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
