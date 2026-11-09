import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="section-shell" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2>404 — Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <div style={{ marginTop: '20px' }}>
        <Link href="/" className="button button-primary">
          Return Home
        </Link>
      </div>
    </main>
  );
}
