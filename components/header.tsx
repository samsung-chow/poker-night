export default function Header() {
  return (
    <header className="w-full flex justify-center px-8 py-4" style={{ backgroundColor: 'var(--background)' }}>
      <nav className="flex space-x-8 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
        <a href="/" className="hover:opacity-85">Home</a>
        <a href="/about" className="hover:opacity-85">About</a>
        <a href="/leaderboard" className="hover:opacity-85">Leaderboard</a>
        <a href="/stats" className="hover:opacity-85">Stats</a>
      </nav>
    </header>
  );
}