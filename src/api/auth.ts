import backendClient from './client'

export async function sendGoogleToken(token: string) {
  try {
    const response = await backendClient.post('/auth/login-with-google', {
      token,
    })
    return response.data
  } catch (e: any) {
    return (
      e.response?.data || { success: false, detail: 'unknown error occurred' }
    )
  }
}

export async function fetchCurrentUser() {
  try {
    const response = await backendClient.get('/auth/current-user')
    return response.data
  } catch (e: any) {
    e.response?.data || { success: false, detail: 'unknown error occurred' }
  }
}

export async function requestLogout() {
  try {
    const response = await backendClient.post('/auth/logout')
    return response.data
  } catch (e: any) {
    e.response?.data || { success: false, detail: 'unknown error occurred' }
  }
}
