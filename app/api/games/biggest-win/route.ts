import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// find most recent game played given pid
// returns all players who played, p/l, gameid, and date played
export async function GET(req: Request) {
  const url = new URL(req.url);
  const pid = url.searchParams.get('pid');

  if (!pid) {
    return NextResponse.json(
      { success: false, error: 'Missing playerid parameter' },
      { status: 400 }
    );
  }

  try {
    const result = await turso.execute({
      sql: `
        SELECT so.sid, so.playerid, so.profitloss, p.name, go.date, go.buyin
        FROM sessions so
          JOIN players p ON so.playerid = p.playerid
          JOIN games go on go.gameid = so.gameid
        WHERE so.gameid IN (
          SELECT g.gameid
          FROM games g JOIN sessions s on g.gameid = s.gameid
          WHERE s.playerid = ?
          ORDER BY s.profitloss DESC
          LIMIT 1)`,
      args: [pid],
    });

    // stopped here

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Query error has occured' }, { status: 404 });
    }

    const sessions = result.rows.map(row => ({
      sid: row.sid as number,
      playerid: row.playerid as number,
      profitloss: row.profitloss as number,
      name: row.name as string,
      date: row.date as string,
      buyin: row.buyin as number,
    }));
    return NextResponse.json({ success: true, sessions });

  } catch (err: unknown) {
    console.error('Failed to get most recent session:', err);
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}