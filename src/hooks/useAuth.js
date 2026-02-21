import useAppStore from '@/store/useAppStore'

export function useAuth() {
  const currentUser = useAppStore((s) => s.currentUser)
  const login = useAppStore((s) => s.login)
  const logout = useAppStore((s) => s.logout)

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
  }
}
