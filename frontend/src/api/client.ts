import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
})

// Interceptor — odpala się przed każdym zapytaniem POST/PATCH/DELETE
apiClient.interceptors.request.use(config => {
  if (['post', 'patch', 'put', 'delete'].includes(config.method ?? '')) {
    // Pobierz token CSRF z ciasteczka ustawionego przez Django
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1]

    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken
    }
  }
  return config
})

export default apiClient