import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(false)
  const [errors, setErrors] = React.useState({})
  const [loginError, setLoginError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  function validate() {
    const errs = {}
    if (!username.trim()) errs.username = 'Username is required'
    if (!password.trim()) errs.password = 'Password is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoginError('')
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    // Simulate async
    await new Promise((r) => setTimeout(r, 100))
    const ok = login(username.trim(), password)
    setLoading(false)
    if (!ok) {
      setLoginError('Invalid username or password')
      return
    }
    navigate('/dashboard', { replace: true })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          autoComplete="username"
          placeholder="Enter username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            setErrors((p) => ({ ...p, username: '' }))
          }}
          data-testid="login-username-input"
          aria-describedby={errors.username ? 'username-error' : undefined}
          aria-invalid={!!errors.username}
        />
        {errors.username && (
          <p id="username-error" className="text-xs text-red-500" role="alert">
            {errors.username}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors((p) => ({ ...p, password: '' }))
            }}
            data-testid="login-password-input"
            aria-describedby={errors.password ? 'password-error' : undefined}
            aria-invalid={!!errors.password}
            className="pr-10"
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            data-testid="toggle-password"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-xs text-red-500" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="remember-me"
          checked={rememberMe}
          onCheckedChange={setRememberMe}
          data-testid="remember-me-checkbox"
        />
        <Label htmlFor="remember-me" className="cursor-pointer font-normal">
          Remember me
        </Label>
      </div>

      {loginError && (
        <p
          role="alert"
          data-testid="login-error-message"
          className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200"
        >
          {loginError}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
        data-testid="login-submit-btn"
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </Button>
    </form>
  )
}
