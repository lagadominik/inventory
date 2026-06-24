import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getItem, createItem, updateItem, getLocations } from '../api/items'

export default function ItemFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    description: '',
    responsible_unit: '',
    location_id: '' as string | number,
  })
  const [error, setError] = useState('')

  // Pobierz dane przedmiotu jeśli edytujemy
  const { data: item } = useQuery({
    queryKey: ['item', id],
    queryFn: () => getItem(id!).then(r => r.data),
    enabled: isEdit,  // odpala się tylko gdy edytujemy
  })

  // Pobierz listę lokalizacji do selecta
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: () => getLocations().then(r => r.data),
  })

  // Gdy dane przedmiotu się załadują, wypełnij formularz
  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description ?? '',
        responsible_unit: item.responsible_unit ?? '',
        location_id: item.location?.id ?? '',
      })
    }
  }, [item])

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...formData,
        location_id: formData.location_id === '' ? null : Number(formData.location_id),
      }
      return isEdit ? updateItem(id!, payload) : createItem(payload)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      navigate(`/items/${response.data.id}`)
    },
    onError: (err: any) => {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Błąd zapisu')
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <Link to="/items">← Powrót do listy</Link>
      <h1>{isEdit ? `Edytuj: ${item?.name}` : 'Dodaj przedmiot'}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>

        <label>
          ID przedmiotu *
          <input
            name="id"
            value={formData.id}
            onChange={handleChange}
            disabled={isEdit}  // ID nie można zmieniać po utworzeniu
            placeholder="np. TOOL-0042"
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: 4 }}
          />
        </label>

        <label>
          Nazwa *
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="np. Śrubokręt krzyżakowy"
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: 4 }}
          />
        </label>

        <label>
          Kategoria *
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="np. Narzędzia, Elektronika"
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: 4 }}
          />
        </label>

        <label>
          Lokalizacja
          <select
            name="location_id"
            value={formData.location_id}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: 4 }}
          >
            <option value="">— brak lokalizacji —</option>
            {locations?.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name}{loc.exact_location ? ` / ${loc.exact_location}` : ''}
              </option>
            ))}
          </select>
        </label>

        <label>
          Jednostka odpowiedzialna
          <input
            name="responsible_unit"
            value={formData.responsible_unit}
            onChange={handleChange}
            placeholder="np. Sekcja Elektroniki"
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: 4 }}
          />
        </label>

        <label>
          Opis
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            style={{ display: 'block', width: '100%', padding: '0.5rem', marginTop: 4 }}
          />
        </label>

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          style={{ padding: '0.75rem', fontSize: '1rem' }}
        >
          {mutation.isPending ? 'Zapisywanie...' : isEdit ? 'Zapisz zmiany' : 'Dodaj przedmiot'}
        </button>
      </div>
    </div>
  )
}