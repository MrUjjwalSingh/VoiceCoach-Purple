"use client"

import { useState } from 'react'
import { protectedAPI, api } from '@/lib/axios-util'
import { getAuthToken, getUserEmail, isAuthenticated } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'

export default function TestJWTPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Check if user is authenticated
  if (!isAuthenticated()) {
    router.push('/auth/login')
    return null
  }

  const testProtectedRoute = async () => {
    setLoading(true)
    try {
      const response = await protectedAPI.testProtectedRoute()
      setResults((prev: any) => ({ ...prev, protectedRoute: response }))
    } catch (error) {
      setResults((prev: any) => ({ ...prev, protectedRoute: { error: 'Failed to test protected route' } }))
    }
    setLoading(false)
  }

  const testUserProfile = async () => {
    setLoading(true)
    try {
      const response = await protectedAPI.getUserProfile()
      setResults((prev: any) => ({ ...prev, userProfile: response }))
    } catch (error) {
      setResults((prev: any) => ({ ...prev, userProfile: { error: 'Failed to fetch user profile' } }))
    }
    setLoading(false)
  }

  const testDashboardData = async () => {
    setLoading(true)
    try {
      const response = await protectedAPI.getDashboardData()
      setResults((prev: any) => ({ ...prev, dashboard: response }))
    } catch (error) {
      setResults((prev: any) => ({ ...prev, dashboard: { error: 'Failed to fetch dashboard data' } }))
    }
    setLoading(false)
  }

  const testCustomRequest = async () => {
    setLoading(true)
    try {
      // This will automatically include the JWT token in headers
      const response = await api.get('/auth/test')
      setResults((prev: any) => ({ ...prev, customRequest: { success: true, data: response.data } }))
    } catch (error: any) {
      setResults((prev: any) => ({ ...prev, customRequest: { error: error.response?.data?.message || 'Failed to make custom request' } }))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">JWT Token Test Page</h1>
        
        <div className="bg-card p-6 rounded-lg border mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Authentication Info:</h2>
          <div className="space-y-2">
            <p><strong>Authenticated:</strong> {isAuthenticated() ? 'Yes' : 'No'}</p>
            <p><strong>Email:</strong> {getUserEmail() || 'Not available'}</p>
            <p><strong>Token:</strong> {getAuthToken() ? `${getAuthToken()?.substring(0, 30)}...` : 'No token'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Test JWT Token Functionality</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testProtectedRoute}
                disabled={loading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                Test Protected Route
              </button>
              
              <button
                onClick={testUserProfile}
                disabled={loading}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50"
              >
                Test User Profile API
              </button>
              
              <button
                onClick={testDashboardData}
                disabled={loading}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50"
              >
                Test Dashboard API
              </button>
              
              <button
                onClick={testCustomRequest}
                disabled={loading}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/90 disabled:opacity-50"
              >
                Test Custom Request
              </button>
            </div>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">API Responses:</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">How JWT Authentication Works:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Login:</strong> User logs in → Backend creates JWT token → Frontend stores token in localStorage</li>
              <li><strong>Automatic Headers:</strong> Every API request automatically includes <code>Authorization: Bearer &lt;token&gt;</code></li>
              <li><strong>Backend Validation:</strong> Backend middleware verifies JWT on each protected request</li>
              <li><strong>Token Expiry:</strong> If token expires, user is automatically redirected to login</li>
              <li><strong>Persistent Auth:</strong> Token persists across browser refreshes and sessions</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-800">Usage Examples:</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p><strong>Basic API call:</strong> <code>api.get('/protected-route')</code></p>
              <p><strong>With data:</strong> <code>api.post('/endpoint', data)</code></p>
              <p><strong>Protected API:</strong> <code>protectedAPI.getUserProfile()</code></p>
              <p><strong>Custom headers:</strong> <code>api.get('/route', &#123; headers: &#123; 'Custom-Header': 'value' &#125; &#125;)</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
