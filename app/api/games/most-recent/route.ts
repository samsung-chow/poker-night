import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// find most recent game played given email
// returns all players who played, p/l, gameid, and date played
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { success: false, error: 'Missing email parameter' },
      { status: 400 }
    );
  }

  try {
    const result = await turso.execute({
      sql: 'SELECT playerid, name FROM Players WHERE email = ?',
      args: [email],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Player not found' }, { status: 404 });
    }

    const row = result.rows[0];
    console.log('playerid:', row.playerid);
    console.log('name:', row.name);
    return NextResponse.json({ success: true, playerid: row.playerid, name: row.name });

  } catch (err: unknown) {
    console.error('Player lookup failed:', err);
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}