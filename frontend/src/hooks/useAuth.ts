import { useQuery } from '@tanstack/react-query'
import apiClient from '../api/client'

export interface AuthUser {
  authenticated: boolean
  username?: string
  is_admin?: boolean
  avatar_url?: string
}

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiClient.get<AuthUser>('/api/me/').then(r => r.data),
    retry: false,
  })

  return {
    user: data,
    isLoading,
    isAuthenticated: data?.authenticated ?? false,
    isAdmin: data?.is_admin ?? false,
  }
}