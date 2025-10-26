// Authentication utility functions

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

export const setAuthToken = (token: string, email?: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
    if (email) {
      localStorage.setItem('user_email', email)
    }
  }
}

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_email')
  }
}

export const isAuthenticated = (): boolean => {
  const token = getAuthToken()
  return !!token
}

export const getUserEmail = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_email')
  }
  return null
}
