import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getItem, deleteItem } from '../api/items'

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: item, isLoading, isError } = useQuery({
    queryKey: ['item', id],
    queryFn: () => getItem(id!).then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteItem(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      navigate('/items')
    },
  })

  if (isLoading) return <div style={{ padding: '2rem' }}>Ładowanie...</div>
  if (isError || !item) return <div style={{ padding: '2rem' }}>Nie znaleziono przedmiotu.</div>

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem' }}>
      {/* Nawigacja */}
      <Link to="/items">← Powrót do listy</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <h1>{item.name}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/items/${item.id}/edit`}>
            <button>✏️ Edytuj</button>
          </Link>
          <button
            onClick={() => {
              if (confirm(`Czy na pewno usunąć "${item.name}"?`)) {
                deleteMutation.mutate()
              }
            }}
            style={{ color: 'red' }}
          >
            🗑️ Usuń
          </button>
        </div>
      </div>

      {/* Dane przedmiotu */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <tbody>
          <Row label="ID" value={item.id} />
          <Row label="Kategoria" value={item.category} />
          <Row label="Lokalizacja" value={item.location ? item.location.name : '—'} />
          <Row label="Dokładne miejsce" value={item.location?.exact_location ?? '—'} />
          <Row label="Jednostka odpowiedzialna" value={item.responsible_unit ?? '—'} />
          <Row label="Opis" value={item.description ?? '—'} />
          <Row label="Dodano" value={new Date(item.created_at).toLocaleString('pl-PL')} />
          <Row label="Ostatnia zmiana" value={new Date(item.updated_at).toLocaleString('pl-PL')} />
        </tbody>
      </table>

      {/* Historia zmian */}
      <h2 style={{ marginTop: '2rem' }}>Historia lokalizacji</h2>
      {item.changelog.length === 0 ? (
        <p>Brak historii zmian.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Data</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Kto</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Skąd</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Dokąd</th>
            </tr>
          </thead>
          <tbody>
            {item.changelog.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>
                  {new Date(log.timestamp).toLocaleString('pl-PL')}
                </td>
                <td style={{ padding: '0.5rem' }}>{log.changed_by ?? '—'}</td>
                <td style={{ padding: '0.5rem' }}>{log.old_location ?? '—'}</td>
                <td style={{ padding: '0.5rem' }}>{log.new_location ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// Pomocniczy komponent — wiersz tabeli z etykietą i wartością
function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr style={{ borderBottom: '1px solid #eee' }}>
      <td style={{ padding: '0.5rem', fontWeight: 'bold', width: '40%' }}>{label}</td>
      <td style={{ padding: '0.5rem' }}>{value}</td>
    </tr>
  )
}