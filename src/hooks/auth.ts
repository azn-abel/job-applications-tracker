import { useState, useEffect } from 'react'
import { fetchCurrentUser, requestLogout, sendGoogleToken } from '@/api/auth'
import { atom, useAtom } from 'jotai'

export const authenticatedAtom = atom(false)

export default function useAuth() {
  const [user, setUser] = useState<null | { username: string }>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useAtom(authenticatedAtom)

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)
      const response = await fetchCurrentUser()
      if (response.success) {
        setUser(response.data)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (token: string) => {
    const response = await sendGoogleToken(token)
    if (response.success) {
      setUser(response.data)
      setIsAuthenticated(true)
    }
    return response
  }
  const logout = async () => {
    const response = await requestLogout()
    if (response.success) {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  return { user, isLoading, login, logout }
}
