import { useAuth } from '../hooks/useAuth'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div style={{ padding: '2rem' }}>Ładowanie...</div>

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 400, margin: '10rem auto', textAlign: 'center' }}>
        <h1>Inwentarz Koła</h1>
        <p>Zaloguj się przez Discord żeby uzyskać dostęp.</p>
        <a href="http://localhost:8000/accounts/discord/login/?process=login">
          <button style={{ padding: '0.75rem 2rem', fontSize: '1rem', background: '#5865F2', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            🎮 Zaloguj przez Discord
          </button>
        </a>
      </div>
    )
  }

  return <>{children}</>
}