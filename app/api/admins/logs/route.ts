import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// adds logs to the data base
export async function POST(req: Request) {
  try {
    const { adminid, description } = await req.json();

    if (!adminid || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing adminid or description' },
        { status: 400 }
      );
    }

    await turso.execute({
      sql: `
        INSERT INTO logs (adminid, desc)
        VALUES (?, ?)
      `,
      args: [adminid, description],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Log write failed:', err);
    return NextResponse.json(
      { success: false, error: 'Log insertion failed' },
      { status: 500 }
    );
  }
}
