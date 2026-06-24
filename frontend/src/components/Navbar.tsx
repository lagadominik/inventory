import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, isAuthenticated } = useAuth()

  return (
    <nav style={{
      background: '#1e1e2e',
      padding: '0.75rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #333'
    }}>
      <Link to="/items" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
        📦 Inwentarz
      </Link>
      {isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
          <span>👤 {user?.username}</span>
          {user?.is_admin && <span style={{ background: '#5865F2', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem' }}>Admin</span>}
          <a href="http://localhost:8000/accounts/logout/" style={{ color: '#aaa', fontSize: '0.9rem' }}>
            Wyloguj
          </a>
        </div>
      )}
    </nav>
  )
}