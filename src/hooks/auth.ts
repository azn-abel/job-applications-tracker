import { useState, useEffect } from 'react'
import {
  fetchCurrentUser,
  requestLogout,
  sendGoogleToken,
} from '@/api/network/auth'
import { atom, useAtom } from 'jotai'

export const authenticatedAtom = atom(false)
export const userAtom = atom<User | null>(null)
export const authLoadingAtom = atom(true)

export default function useAuth() {
  const [isLoading, setIsLoading] = useAtom(authLoadingAtom)
  const [isAuthenticated, setIsAuthenticated] = useAtom(authenticatedAtom)
  const [user, setUser] = useAtom(userAtom)

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

    return () => {
      console.log('unmount')
    }
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

  return { user, isAuthenticated, isLoading, login, logout }
}
