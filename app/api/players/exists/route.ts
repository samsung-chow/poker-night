// app/api/players/exists/route.ts
import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// checks if player exists in the database
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
  }

  try {
    const result = await turso.execute({
      sql: `SELECT COUNT(*) as count FROM Players WHERE email = ?`,
      args: [email],
    });

    const count = result.rows[0].count as number;
    const exists = count > 0;

    return NextResponse.json({ exists });
  } catch (err) {
    console.error('Player existence check failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// creates a new player in the database
export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await turso.execute({
      sql: 'INSERT INTO Players (name, email) VALUES (?, ?)',
      args: [name, email],
    });

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error('Player insert failed:', err);

    let message = 'Unknown error';
    if (err instanceof Error && err.message.includes('UNIQUE constraint failed')) {
      message = 'Email already exists';
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
