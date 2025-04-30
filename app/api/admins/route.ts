// app/api/players/exists/route.ts
import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(req: Request) {
  const { adminid, password } = await req.json()
  // console.log("Adminid:", adminid);
  // console.log("Password:", password);

  if (!adminid || !password) {
    return NextResponse.json({ error: 'missing adminid or password' }, { status: 400 });
  }

  try {
    const result = await turso.execute({
      sql: `SELECT COUNT(*) as count FROM Admins WHERE adminid = ? AND password = ?`,
      args: [adminid, password],
    });

    const count = result.rows[0].count as number;
    const exists = count > 0;

    return NextResponse.json({ exists });
  } catch (err) {
    console.error('Admin verification failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
