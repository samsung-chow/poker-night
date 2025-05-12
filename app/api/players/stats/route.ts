import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// returns all sessions for a given player
export async function POST(req: NextRequest) {
  try {
    const { playerId } = await req.json();

    if (typeof playerId !== 'number') {
      return NextResponse.json({ error: 'Invalid playerId' }, { status: 400 });
    }

    const result = await turso.execute({
      sql: `
      SELECT s.sid, s.playerid, s.gameid, s.profitloss, g.date 
      FROM Sessions s JOIN Games g ON s.gameid = g.gameid WHERE playerid = ?
      ORDER BY g.date ASC
      `,
      args: [playerId],
    });

    const sessions = result.rows.map(row => ({
      sid: row.sid as number,
      playerid: row.playerid as number,
      gameid: row.gameid as number,
      profitloss: row.profitloss as number,
      date: row.date as string,
    }));

    return NextResponse.json({ sessions, success: true });
  } catch (err) {
    console.error('Session fetch failed:', err);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
