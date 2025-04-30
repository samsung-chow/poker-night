import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(req: Request) {
  try {
    const { buyin, hostid } = await req.json();

    if (!buyin || !hostid) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await turso.execute({
      sql: 'INSERT INTO Games (buyin, host) VALUES (?, ?)',
      args: [buyin, hostid],
    });

    const res = await turso.execute({
      sql: 'SELECT last_insert_rowid() as gameid',
      args: [],
    })
    const gameid = res.rows[0].gameid as number;

    return NextResponse.json({ success: true, gameid });

  } catch (err: unknown) {
    console.error('Game insert failed:', err);
    return NextResponse.json(
      { success: false,},
      { status: 400 }
    );
  }
}
