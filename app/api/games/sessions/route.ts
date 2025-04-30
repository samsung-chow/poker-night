import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(req: Request) {
  try {
    const { playerid, gameid, profitloss } = await req.json();

    if (
      typeof playerid !== 'number' ||
      typeof gameid !== 'number' ||
      typeof profitloss !== 'number'
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing fields' },
        { status: 400 }
      );
    }

    await turso.execute({
      sql: `
        INSERT INTO Sessions (playerid, gameid, profitloss)
        VALUES (?, ?, ?)
      `,
      args: [playerid, gameid, profitloss],
    });

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error('Game session insert failed:', err);

    return NextResponse.json(
      { success: false,},
      { status: 400 }
    );
  }
}
