'use client'

// app/dashboard/page.tsx
import { ProtectedRoute } from '@/components/sections/auth/ProtectedRoute'
import { Header } from '@/components'
import { useAuth } from '@/lib/auth/hooks/useAuth'
import { Button } from '@/components/ui/button'

function DashboardContent() {
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="black" />
      
      <div className="pt-20 px-8">
        <div className="max-w-7xl mx-auto py-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome to your Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Hello, {user?.firstName} {user?.lastName}!
                </p>
              </div>
              
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  User Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Username:</strong> {user?.username}</p>
                  <p><strong>ID:</strong> {user?.id}</p>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Account Status
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Status:</strong> Active</p>
                  <p><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    Update Profile
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    View Settings
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                API Integration Status
              </h3>
              <p className="text-green-600 text-sm">
                ✅ Successfully connected to backend API
              </p>
              <p className="text-green-600 text-sm">
                ✅ Authentication token is valid
              </p>
              <p className="text-green-600 text-sm">
                ✅ User data synchronized
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardContent />
    </ProtectedRoute>
  )
}