import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getItems } from '../api/items'
import type { Item } from '../api/items'

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50]

export default function ItemListPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)

  // useQuery pobiera dane z API i zarządza stanem (loading/error/data)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['items', search],  // gdy search się zmieni, zapytanie się odświeży
    queryFn: () => getItems(search).then(r => r.data),
  })

  const items = data ?? []
  // Paginacja po stronie frontendu
  const totalPages = Math.ceil(items.length / perPage)
  const paginated = items.slice((page - 1) * perPage, page * perPage)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Inwentarz</h1>
        <Link to="/items/new">
          <button>+ Dodaj przedmiot</button>
        </Link>
      </div>

      {/* Wyszukiwarka */}
      <input
        type="text"
        placeholder="Szukaj po nazwie, ID, kategorii..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1) }}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}
      />

      {/* Ilość na stronę */}
      <div style={{ marginBottom: '1rem' }}>
        Pozycji na stronę:{' '}
        {ITEMS_PER_PAGE_OPTIONS.map(n => (
          <button
            key={n}
            onClick={() => { setPerPage(n); setPage(1) }}
            style={{ marginLeft: 4, fontWeight: perPage === n ? 'bold' : 'normal' }}
          >
            {n}
          </button>
        ))}
      </div>

      {isLoading && <p>Ładowanie...</p>}
      {isError && <p>Błąd połączenia z API</p>}

      {/* Tabela */}
      {!isLoading && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>ID</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nazwa</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Kategoria</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Lokalizacja</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item: Item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>
                  <Link to={`/items/${item.id}`}>{item.id}</Link>
                </td>
                <td style={{ padding: '0.5rem' }}>{item.name}</td>
                <td style={{ padding: '0.5rem' }}>{item.category}</td>
                <td style={{ padding: '0.5rem' }}>
                  {item.location ? item.location.name : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Paginacja */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: 8 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          ← Poprzednia
        </button>
        <span>Strona {page} / {totalPages || 1}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}>
          Następna →
        </button>
      </div>
    </div>
  )
}