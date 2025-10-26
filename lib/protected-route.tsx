'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated as checkAuthStatus } from './auth-utils'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = checkAuthStatus()
      setIsAuthenticated(authStatus)
      setIsLoading(false)

      if (!authStatus) {
        // Redirect to login page if not authenticated
        router.push('/auth/login')
      }
    }

    checkAuth()
  }, [router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null
  }

  // If authenticated, render the protected content
  return <>{children}</>
}

export default ProtectedRoute
