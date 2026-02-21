import * as React from 'react'
import useAppStore from '@/store/useAppStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { currentUser } = useAuth()
  const updateProfile = useAppStore((s) => s.updateProfile)
  const changePassword = useAppStore((s) => s.changePassword)

  const [name, setName] = React.useState(currentUser?.name || '')
  const [email, setEmail] = React.useState(currentUser?.email || '')

  const [oldPassword, setOldPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  const [passwordSuccess, setPasswordSuccess] = React.useState('')

  // Sync if currentUser changes
  React.useEffect(() => {
    setName(currentUser?.name || '')
    setEmail(currentUser?.email || '')
  }, [currentUser])

  function handleProfileSave(e) {
    e.preventDefault()
    updateProfile({ name, email })
    toast.success('Profile updated', { 'data-testid': 'toast-success' })
  }

  function handlePasswordChange(e) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    const ok = changePassword(oldPassword, newPassword)
    if (!ok) {
      setPasswordError('Current password is incorrect')
      return
    }

    setPasswordSuccess('Password changed successfully')
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    toast.success('Password changed', { 'data-testid': 'toast-success' })
  }

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      {/* Profile info card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="profile-name-input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="profile-email-input"
              />
            </div>
            <Button type="submit" data-testid="profile-save-btn">
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} noValidate className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="old-password">Current Password</Label>
              <Input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value)
                  setPasswordError('')
                }}
                data-testid="old-password-input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setPasswordError('')
                }}
                data-testid="new-password-input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setPasswordError('')
                }}
                data-testid="confirm-password-input"
              />
            </div>

            {passwordError && (
              <p
                role="alert"
                data-testid="password-error-msg"
                className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200"
              >
                {passwordError}
              </p>
            )}

            {passwordSuccess && (
              <p
                role="status"
                data-testid="password-success-msg"
                className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200"
              >
                {passwordSuccess}
              </p>
            )}

            <Button type="submit" data-testid="change-password-btn">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
