import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full flex justify-center px-8 py-4" style={{ backgroundColor: 'var(--background)' }}>
      <nav className="flex space-x-8 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
        <Link href="/" className="hover:opacity-85">Home</Link>
        <Link href="/about" className="hover:opacity-85">About</Link>
        <Link href="/leaderboard" className="hover:opacity-85">Leaderboard</Link>
        <Link href="/stats" className="hover:opacity-85">Stats</Link>
      </nav>
    </header>
  );
}