import axios from 'axios'

const backendClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export default backendClient
