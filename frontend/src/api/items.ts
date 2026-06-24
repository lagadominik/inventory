import apiClient from './client'

// Typy TypeScript — opisują jak wygląda danych z API
export interface Location {
  id: number
  name: string
  exact_location: string | null
}

export interface ChangeLog {
  id: number
  changed_by: string
  old_location: string | null
  new_location: string | null
  note: string | null
  timestamp: string
}

export interface Item {
  id: string
  name: string
  category: string
  description: string | null
  responsible_unit: string | null
  photo_url: string | null
  location: Location | null
  changelog: ChangeLog[]
  created_at: string
  updated_at: string
}

// Funkcje do komunikacji z API
export const getItems = (search?: string) =>
  apiClient.get<Item[]>('/api/items/', { params: { search } })

export const getItem = (id: string) =>
  apiClient.get<Item>(`/api/items/${id}/`)

export const createItem = (data: Partial<Item> & { location_id?: number }) =>
  apiClient.post<Item>('/api/items/', data)

export const updateItem = (id: string, data: Partial<Item> & { location_id?: number | null }) =>
  apiClient.patch<Item>(`/api/items/${id}/`, data)

export const deleteItem = (id: string) =>
  apiClient.delete(`/api/items/${id}/`)

export const getLocations = () =>
  apiClient.get<Location[]>('/api/locations/')