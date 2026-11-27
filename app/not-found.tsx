import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-sm text-muted mb-4">Could not find requested resource</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-teal-accent text-white font-medium text-sm transition-colors hover:bg-teal-hover shadow-soft"
      >
        Return Home
      </Link>
    </div>
  );
}
