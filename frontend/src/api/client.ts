import axios from 'axios'

// Bazowy URL do Django API
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,  // wysyłaj ciasteczka sesji przy każdym zapytaniu
})

export default apiClient