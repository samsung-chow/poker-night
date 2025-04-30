import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(req: Request) {
  try {
    const { name, email, date } = await req.json();
    if (!name || !email || !date) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await turso.execute({
      sql: `INSERT INTO Players (name, email, joindate) VALUES (?, ?, ?)`,
      args: [name, email, date],
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Player creation failed:', err);

    let message = 'Unknown error';
    if (err instanceof Error && err.message.includes('UNIQUE constraint failed')) {
      message = 'Email already exists';
    }

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

// Optional: GET all players (for testing/admin)
export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM Players');

    const players = result.rows.map(row => ({
      playerId: row.playerid,
      name: row.name,
      email: row.email,
      joinDate: row.joindate,
    }));

    return NextResponse.json(players);
  } catch (err: unknown) {
    console.error('Fetching all players failed:', err);
    return NextResponse.json({ error: 'Failed to retrieve players' }, { status: 500 });
  }
}
